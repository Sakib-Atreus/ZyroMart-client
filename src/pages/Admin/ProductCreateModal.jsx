import { useEffect, useMemo, useState } from "react";
import {
  Modal, Form, Input, InputNumber, Select, Row, Col, Divider, Button, Space,
  Tag, Card, Alert, message,
} from "antd";
import { PlusOutlined, MinusCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { categoryApi, productApi, vendorApi } from "../../api/endpoints";

/**
 * Comprehensive admin product creation modal.
 * Steps user does:
 *  1. Pick an approved vendor
 *  2. Pick a category (drives dynamic `attributes` + `variantOptions` keys)
 *  3. Fill in name/brand/price/description/images
 *  4. Optionally declare variantOptions (e.g. color/storage values)
 *  5. Fill in attributes constrained by category.attributeSchema
 */
const ProductCreateModal = ({ open, onClose, onCreated }) => {
  const [form] = Form.useForm();
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [hasVariants, setHasVariants] = useState(false);

  useEffect(() => {
    if (!open) return;
    const load = async () => {
      try {
        const [v, c] = await Promise.all([
          vendorApi.adminList({ status: "approved" }),
          categoryApi.list(),
        ]);
        setVendors(v.data?.vendors || []);
        setCategories(c.data || []);
      } catch (err) {
        message.error(err.message || "Failed to load selectors");
      }
    };
    load();
  }, [open]);

  const handleCategoryChange = (id) => {
    const cat = categories.find((c) => c._id === id);
    setSelectedCategory(cat || null);
    form.setFieldsValue({ attributes: {}, variantOptions: [] });
  };

  const variantCapableKeys = useMemo(
    () =>
      (selectedCategory?.attributeSchema || [])
        .filter((a) => a.isVariantOption)
        .map((a) => ({
          value: a.key,
          label: `${a.label || a.key}${a.unit ? ` (${a.unit})` : ""}`,
        })),
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

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const images = (values.images || "")
        .split(/[\s,]+/)
        .map((s) => s.trim())
        .filter(Boolean);

      const tags = (values.tags || "")
        .split(/[\s,]+/)
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        vendor: values.vendor,
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

      await productApi.create(payload);
      message.success("Product created and approved");
      form.resetFields();
      setSelectedCategory(null);
      setHasVariants(false);
      onCreated?.();
      onClose();
    } catch (err) {
      message.error(err.message || "Failed to create product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Create Product"
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Create"
      confirmLoading={submitting}
      width={900}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ hasVariants: false, currency: "BDT" }}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="vendor" label="Vendor" rules={[{ required: true }]}>
              <Select
                showSearch
                placeholder="Select approved vendor"
                optionFilterProp="label"
                options={vendors.map((v) => ({
                  value: v._id,
                  label: `${v.shopName} — ${v.slug}`,
                }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="category" label="Category" rules={[{ required: true }]}>
              <Select
                showSearch
                placeholder="Select category"
                optionFilterProp="label"
                onChange={handleCategoryChange}
                options={categories.map((c) => ({ value: c._id, label: c.name }))}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="name" label="Name" rules={[{ required: true, min: 2 }]}>
              <Input placeholder="HONOR X6b" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="brand" label="Brand" rules={[{ required: true }]}>
              <Input placeholder="HONOR" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label="Description" rules={[{ required: true, min: 10 }]}>
          <Input.TextArea rows={3} />
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
            <Form.Item name="currency" label="Currency">
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="images"
          label="Image URLs"
          rules={[{ required: true }]}
          tooltip="Comma- or newline-separated URLs. The first will be used as thumbnail if none provided."
        >
          <Input.TextArea rows={2} placeholder="https://... , https://..." />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="thumbnail" label="Thumbnail URL (optional)">
              <Input placeholder="https://... (defaults to first image)" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="tags" label="Tags (comma-separated)">
              <Input placeholder="budget, honor, 90hz" />
            </Form.Item>
          </Col>
        </Row>

        {selectedCategory && (
          <>
            <Divider orientation="left">Category attributes</Divider>
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
                {hasVariants ? "enabled" : "single-variant product"}
              </Tag>
            </Divider>

            {!hasVariantCapableAttrs && (
              <Alert
                type="warning"
                showIcon
                icon={<InfoCircleOutlined />}
                message="This category has no variant-capable attributes"
                description="Mark at least one attribute as 'variant-capable' on this category before enabling variants. Without that, only a single SKU can be created."
                style={{ marginBottom: 12 }}
              />
            )}

            {hasVariantCapableAttrs && (
              <p style={{ color: "#595959", marginTop: -8 }}>
                Variant-capable attributes:{" "}
                {variantCapableKeys.map((k) => (
                  <Tag key={k.value} color="purple">{k.label}</Tag>
                ))}
              </p>
            )}

            <Form.Item name="hasVariants" label="This product has variants">
              <Select
                options={[
                  { value: false, label: "No — single SKU" },
                  { value: true, label: "Yes — multiple variants" },
                ]}
                onChange={setHasVariants}
                disabled={!hasVariantCapableAttrs}
              />
            </Form.Item>

            {hasVariants && (
              <>
                <p style={{ color: "#8c8c8c", marginTop: -8 }}>
                  Declare which attributes differentiate variants. Variants can be bulk-generated
                  afterwards via <code>POST /variants/bulk</code>.
                </p>
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
                              rules={[{ required: true }]}
                            >
                              <Select
                                options={variantCapableKeys}
                                style={{ width: 160 }}
                                placeholder="color, ram..."
                              />
                            </Form.Item>
                            <Form.Item
                              {...rest}
                              name={[name, "label"]}
                              label="label"
                              rules={[{ required: true }]}
                            >
                              <Input style={{ width: 140 }} placeholder="Color" />
                            </Form.Item>
                            <Form.Item
                              {...rest}
                              name={[name, "values"]}
                              label="values (comma-separated)"
                              rules={[{ required: true }]}
                            >
                              <Input style={{ width: 280 }} placeholder="Black, Green" />
                            </Form.Item>
                          </Space>
                        </Card>
                      ))}
                      <Button type="dashed" block icon={<PlusOutlined />} onClick={() => add()}>
                        Add variant dimension
                      </Button>
                    </>
                  )}
                </Form.List>
              </>
            )}
          </>
        )}
      </Form>
    </Modal>
  );
};

export default ProductCreateModal;
