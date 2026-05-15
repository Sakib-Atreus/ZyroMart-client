import { useEffect, useMemo, useState } from "react";
import {
  Modal, Form, Input, InputNumber, Select, Row, Col, Divider, Button, Card, Space,
  Alert, Tag, message,
} from "antd";
import { PlusOutlined, MinusCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { categoryApi, productApi, variantApi } from "../../api/endpoints";

/**
 * Vendor product create / edit modal.
 *
 * Variants flow:
 *  1. Vendor picks a category.
 *  2. "Category attributes" section renders inputs for every non-variant attribute
 *     (e.g. display_size, battery_mah).
 *  3. If the category has attributes marked "variant-capable" (isVariantOption:true)
 *     the "Variants" section becomes available. The vendor can then declare
 *     variant dimensions (e.g. color: [Black, Green]) and enter a default stock.
 *  4. On submit, the product is created (status=pending), then variantApi.bulk()
 *     auto-generates one Variant per combination with the default price/stock.
 *  5. Afterwards the vendor can fine-tune individual variants in the Variants drawer.
 */
const ProductFormModal = ({ open, onClose, onSaved, product }) => {
  const isEdit = !!product;
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [hasVariants, setHasVariants] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    categoryApi
      .list()
      .then((res) => {
        const list = res.data || [];
        setCategories(list);
        if (isEdit && product?.category) {
          const cat = list.find((c) => c._id === (product.category._id || product.category));
          setSelectedCategory(cat || null);
        }
      })
      .catch(() => setCategories([]));
  }, [open, isEdit, product]);

  useEffect(() => {
    if (!open) return;
    if (isEdit && product) {
      form.setFieldsValue({
        category: product.category?._id || product.category,
        name: product.name,
        brand: product.brand,
        description: product.description,
        shortDescription: product.shortDescription,
        basePrice: product.basePrice,
        compareAtPrice: product.compareAtPrice,
        hasVariants: product.hasVariants,
        variantOptions: (product.variantOptions || []).map((v) => ({
          key: v.key,
          label: v.label,
          values: (v.values || []).join(", "),
        })),
        attributes: Object.fromEntries(Object.entries(product.attributes || {})),
        images: (product.images || []).join("\n"),
        thumbnail: product.thumbnail,
        tags: (product.tags || []).join(", "),
        warranty: product.warranty,
      });
      setHasVariants(!!product.hasVariants);
    } else {
      form.resetFields();
      form.setFieldsValue({ hasVariants: false, defaultStock: 10 });
      setHasVariants(false);
      setSelectedCategory(null);
    }
  }, [open, isEdit, product, form]);

  const handleCategoryChange = (id) => {
    const cat = categories.find((c) => c._id === id);
    setSelectedCategory(cat || null);
    form.setFieldsValue({ attributes: {}, variantOptions: [], hasVariants: false });
    setHasVariants(false);
  };

  const variantCapableKeys = useMemo(
    () =>
      (selectedCategory?.attributeSchema || [])
        .filter((a) => a.isVariantOption)
        .map((a) => ({ value: a.key, label: `${a.label || a.key}${a.unit ? ` (${a.unit})` : ""}` })),
    [selectedCategory],
  );

  const hasVariantCapableAttrs = variantCapableKeys.length > 0;

  const renderAttributeInput = (attr) => {
    const common = { style: { width: "100%" } };
    switch (attr.type) {
      case "number":
        return <InputNumber {...common} addonAfter={attr.unit} />;
      case "boolean":
        return (
          <Select
            {...common}
            options={[
              { value: true, label: "Yes" },
              { value: false, label: "No" },
            ]}
          />
        );
      case "enum":
        return (
          <Select
            {...common}
            options={(attr.options || []).map((o) => ({ value: o, label: o }))}
          />
        );
      case "multiselect":
        return (
          <Select
            {...common}
            mode="multiple"
            options={(attr.options || []).map((o) => ({ value: o, label: o }))}
          />
        );
      default:
        return <Input {...common} addonAfter={attr.unit} />;
    }
  };

  const buildPayload = (values) => {
    const images = (values.images || "")
      .split(/[\s,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const tags = (values.tags || "")
      .split(/[\s,]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    return {
      category: values.category,
      name: values.name,
      brand: values.brand,
      description: values.description,
      shortDescription: values.shortDescription || undefined,
      images,
      thumbnail: values.thumbnail || images[0],
      basePrice: Number(values.basePrice),
      compareAtPrice: values.compareAtPrice ? Number(values.compareAtPrice) : undefined,
      hasVariants: !!values.hasVariants,
      variantOptions: values.hasVariants
        ? (values.variantOptions || []).map((v) => ({
            key: v.key,
            label: v.label,
            values: (v.values || "")
              .split(/[,\n]/)
              .map((s) => s.trim())
              .filter(Boolean),
          }))
        : [],
      attributes: values.attributes || {},
      tags,
      warranty: values.warranty || undefined,
    };
  };

  const handleSubmit = async (values) => {
    // Front-end guard before sending
    if (values.hasVariants) {
      const opts = values.variantOptions || [];
      if (opts.length === 0) {
        message.error("Add at least one variant dimension (e.g. Color) or disable variants.");
        return;
      }
      for (const opt of opts) {
        const vals = (opt.values || "").split(/[,\n]/).map((s) => s.trim()).filter(Boolean);
        if (vals.length === 0) {
          message.error(`Variant '${opt.key}' needs at least one value (comma-separated).`);
          return;
        }
      }
    }

    setSubmitting(true);
    try {
      const payload = buildPayload(values);
      if (isEdit) {
        await productApi.update(product._id, payload);
        message.success("Product updated — awaiting re-approval");
      } else {
        const res = await productApi.create(payload);
        const created = res.data;
        message.success("Product submitted for approval");

        if (payload.hasVariants) {
          try {
            await variantApi.bulk({
              product: created._id,
              defaults: {
                price: payload.basePrice,
                stock: Number(values.defaultStock) || 0,
              },
            });
            message.success("Variants auto-generated");
          } catch (err) {
            message.warning(
              "Product created, but auto-generating variants failed: " + (err.message || ""),
            );
          }
        }
      }
      onSaved?.();
      onClose();
    } catch (err) {
      message.error(err.message || "Failed to save");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={isEdit ? `Edit: ${product?.name ?? ""}` : "Create Product"}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText={isEdit ? "Save changes" : "Submit for approval"}
      confirmLoading={submitting}
      width={900}
      destroyOnClose
    >
      {isEdit && (
        <Alert
          type="info"
          showIcon
          message="Editing resets status to 'pending'"
          description="Admin will need to re-approve. For quick stock or price updates, use the Variants drawer instead — those don't require re-approval."
          style={{ marginBottom: 16 }}
        />
      )}

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="category" label="Category" rules={[{ required: true }]}>
          <Select
            showSearch
            placeholder="Select category"
            optionFilterProp="label"
            onChange={handleCategoryChange}
            options={categories.map((c) => ({ value: c._id, label: c.name }))}
            disabled={isEdit}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="name" label="Name" rules={[{ required: true, min: 2 }]}>
              <Input placeholder="e.g. HONOR X6b" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="brand" label="Brand" rules={[{ required: true }]}>
              <Input placeholder="HONOR" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, min: 10, message: "At least 10 characters" }]}
        >
          <Input.TextArea rows={3} placeholder="Describe the product — minimum 10 characters" />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="shortDescription" label="Short description">
              <Input maxLength={300} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="warranty" label="Warranty">
              <Input placeholder="12 Months" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item name="basePrice" label="Base price" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: "100%" }} addonAfter="BDT" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="compareAtPrice" label="Compare at price (MSRP)">
              <InputNumber min={0} style={{ width: "100%" }} addonAfter="BDT" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="tags" label="Tags">
              <Input placeholder="budget, honor" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="images"
          label="Image URLs"
          rules={[{ required: true }]}
          tooltip="Comma- or newline-separated URLs. First is the thumbnail if none specified."
        >
          <Input.TextArea rows={2} placeholder="https://... , https://..." />
        </Form.Item>

        <Form.Item name="thumbnail" label="Thumbnail URL (optional)">
          <Input placeholder="defaults to first image" />
        </Form.Item>

        {selectedCategory && (
          <>
            <Divider orientation="left">Category attributes</Divider>
            {selectedCategory.attributeSchema?.filter((a) => !a.isVariantOption).length === 0 && (
              <p style={{ color: "#8c8c8c", marginTop: -8, marginBottom: 16 }}>
                No fixed attributes defined on this category.
              </p>
            )}
            <Row gutter={16}>
              {(selectedCategory.attributeSchema || [])
                .filter((a) => !a.isVariantOption)
                .map((attr) => (
                  <Col key={attr.key} xs={24} md={12}>
                    <Form.Item
                      name={["attributes", attr.key]}
                      label={`${attr.label}${attr.unit ? ` (${attr.unit})` : ""}`}
                      rules={attr.required ? [{ required: true }] : []}
                    >
                      {renderAttributeInput(attr)}
                    </Form.Item>
                  </Col>
                ))}
            </Row>

            <Divider orientation="left">
              Variants{" "}
              <Tag color={hasVariants ? "green" : "default"}>
                {hasVariants ? "enabled" : "single SKU"}
              </Tag>
            </Divider>

            {!hasVariantCapableAttrs && (
              <Alert
                type="warning"
                showIcon
                icon={<InfoCircleOutlined />}
                message="This category has no variant-capable attributes"
                description="Variants let you offer the same product in multiple colors / RAM / storage combinations. To enable that, an admin must mark one or more attributes (like Color, RAM, Storage) as 'variant-capable' on this category. Without at least one, you can only sell a single SKU."
                style={{ marginBottom: 12 }}
              />
            )}

            {hasVariantCapableAttrs && (
              <p style={{ color: "#595959", marginTop: -8 }}>
                Variant-capable attributes on this category:{" "}
                {variantCapableKeys.map((k) => (
                  <Tag key={k.value} color="purple">
                    {k.label}
                  </Tag>
                ))}
              </p>
            )}

            <Form.Item
              name="hasVariants"
              label="Does this product have multiple variants?"
            >
              <Select
                options={[
                  { value: false, label: "No — single SKU" },
                  { value: true, label: "Yes — multiple variants (color / RAM / storage / ...)" },
                ]}
                onChange={(v) => {
                  setHasVariants(v);
                  if (!v) form.setFieldsValue({ variantOptions: [] });
                }}
                disabled={isEdit || !hasVariantCapableAttrs}
              />
            </Form.Item>

            {hasVariants && (
              <>
                <Alert
                  type="info"
                  showIcon
                  message="How variants work"
                  description={
                    <ol style={{ paddingLeft: 20, margin: 0 }}>
                      <li>Pick a variant-capable attribute (e.g. Color).</li>
                      <li>Enter comma-separated values (e.g. "Black, Green, Blue").</li>
                      <li>Repeat for each dimension (RAM, Storage).</li>
                      <li>On submit, one SKU is generated per combination. You can edit stock/price per SKU afterwards in the Variants drawer.</li>
                    </ol>
                  }
                  style={{ marginBottom: 12 }}
                />

                <Form.List name="variantOptions">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...rest }) => (
                        <Card
                          key={key}
                          size="small"
                          style={{ marginBottom: 12 }}
                          extra={
                            <Button
                              type="text"
                              danger
                              icon={<MinusCircleOutlined />}
                              onClick={() => remove(name)}
                            />
                          }
                        >
                          <Space wrap>
                            <Form.Item
                              {...rest}
                              name={[name, "key"]}
                              label="attribute"
                              rules={[{ required: true, message: "Pick an attribute" }]}
                            >
                              <Select
                                options={variantCapableKeys}
                                style={{ width: 180 }}
                                placeholder="color / ram / storage"
                                disabled={isEdit}
                                onChange={(val) => {
                                  const match = variantCapableKeys.find((k) => k.value === val);
                                  if (match) {
                                    const current = form.getFieldValue("variantOptions") || [];
                                    current[name] = {
                                      ...current[name],
                                      key: val,
                                      label: current[name]?.label || match.label.replace(/\s\(.*\)$/, ""),
                                    };
                                    form.setFieldsValue({ variantOptions: current });
                                  }
                                }}
                              />
                            </Form.Item>
                            <Form.Item
                              {...rest}
                              name={[name, "label"]}
                              label="label"
                              rules={[{ required: true, message: "Enter a label" }]}
                            >
                              <Input style={{ width: 140 }} placeholder="Color" disabled={isEdit} />
                            </Form.Item>
                            <Form.Item
                              {...rest}
                              name={[name, "values"]}
                              label="values (comma-separated)"
                              rules={[{ required: true, message: "Enter at least one value" }]}
                            >
                              <Input style={{ width: 300 }} placeholder="Black, Green" disabled={isEdit} />
                            </Form.Item>
                          </Space>
                        </Card>
                      ))}
                      {!isEdit && (
                        <Button
                          type="dashed"
                          block
                          icon={<PlusOutlined />}
                          onClick={() => add()}
                          disabled={fields.length >= variantCapableKeys.length}
                        >
                          Add variant dimension
                          {fields.length >= variantCapableKeys.length && " (all used)"}
                        </Button>
                      )}
                    </>
                  )}
                </Form.List>

                {!isEdit && (
                  <Form.Item
                    name="defaultStock"
                    label="Default stock per generated variant"
                    tooltip="Applied to every SKU when variants are auto-generated. Adjust each variant's stock afterwards in the Variants drawer."
                    style={{ marginTop: 16 }}
                    rules={[{ required: true, message: "Required" }]}
                  >
                    <InputNumber min={0} style={{ width: "100%" }} />
                  </Form.Item>
                )}
              </>
            )}
          </>
        )}
      </Form>
    </Modal>
  );
};

export default ProductFormModal;
