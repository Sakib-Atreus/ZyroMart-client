import { useEffect, useRef, useState, useCallback } from "react";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Col,
  Empty,
  Input,
  Row,
  Skeleton,
  Space,
  Spin,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import {
  CustomerServiceOutlined,
  ReloadOutlined,
  SearchOutlined,
  SendOutlined,
  ShopOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { chatApi } from "../../api/endpoints";

const { Text, Title, Paragraph } = Typography;
const POLL_INTERVAL = 5000;

const formatTime = (d) => {
  if (!d) return "";
  const date = new Date(d);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return (
    date.toLocaleDateString([], { month: "short", day: "numeric" }) +
    " " +
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
};

const AdminChat = () => {
  const [conversations, setConversations] = useState([]);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const bottomRef = useRef(null);
  const pollRef = useRef(null);
  const activeConvIdRef = useRef(null);

  const scrollToBottom = () => bottomRef.current?.scrollIntoView({ behavior: "smooth" });

  const fetchConversations = useCallback(async (silent = false) => {
    if (!silent) setLoadingConvs(true);
    try {
      const res = await chatApi.listConversations();
      const list = res.data ?? res ?? [];
      setConversations(Array.isArray(list) ? list : []);
    } catch (err) {
      if (!silent) setError(err.message || "Failed to load conversations");
    } finally {
      if (!silent) setLoadingConvs(false);
    }
  }, []);

  const fetchMessages = useCallback(async (convId, silent = false) => {
    if (!convId) return;
    if (!silent) setLoadingMsgs(true);
    try {
      const res = await chatApi.getMessages(convId);
      const msgs = res.data ?? res ?? [];
      setMessages(Array.isArray(msgs) ? msgs : []);
      // Reset unread for this conversation in local state after reading
      setConversations((prev) =>
        prev.map((c) => (c._id === convId ? { ...c, unreadByAdmin: 0 } : c))
      );
    } catch (err) {
      if (!silent) setError(err.message || "Failed to load messages");
    } finally {
      if (!silent) setLoadingMsgs(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (!activeConv) return;
    activeConvIdRef.current = activeConv._id;
    fetchMessages(activeConv._id);
  }, [activeConv, fetchMessages]);

  // Poll: refresh messages + conversation unread counts
  useEffect(() => {
    pollRef.current = setInterval(() => {
      if (activeConvIdRef.current) fetchMessages(activeConvIdRef.current, true);
      fetchConversations(true);
    }, POLL_INTERVAL);
    return () => clearInterval(pollRef.current);
  }, [fetchMessages, fetchConversations]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSelectConv = (conv) => {
    setActiveConv(conv);
    setMessages([]);
    setText("");
  };

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || !activeConv || sending) return;
    setSending(true);
    try {
      const res = await chatApi.adminSend(activeConv._id, { body: trimmed });
      const newMsg = res.data ?? res;
      setText("");
      setMessages((prev) => [...prev, newMsg]);
      setConversations((prev) =>
        prev.map((c) =>
          c._id === activeConv._id
            ? { ...c, lastMessage: trimmed, lastMessageAt: new Date() }
            : c
        )
      );
      setTimeout(scrollToBottom, 50);
    } catch (err) {
      setError(err.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const vendorName = (conv) =>
    conv?.vendor?.shopName ?? conv?.vendorUser?.name ?? "Unknown Vendor";

  const vendorInitial = (conv) => vendorName(conv).charAt(0).toUpperCase();

  const filteredConvs = conversations.filter((c) =>
    vendorName(c).toLowerCase().includes(search.toLowerCase())
  );

  const totalUnread = conversations.reduce((s, c) => s + (c.unreadByAdmin ?? 0), 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>
            Vendor Support Chat
            {totalUnread > 0 && (
              <Badge count={totalUnread} style={{ marginLeft: 10, verticalAlign: "middle" }} />
            )}
          </Title>
          <Paragraph type="secondary" style={{ margin: 0 }}>
            {conversations.length} conversation{conversations.length !== 1 ? "s" : ""}
          </Paragraph>
        </div>
        <Tooltip title="Refresh">
          <Button icon={<ReloadOutlined />} onClick={() => fetchConversations()}>
            Refresh
          </Button>
        </Tooltip>
      </div>

      {error && (
        <Alert type="error" message={error} showIcon closable onClose={() => setError(null)} />
      )}

      <Row
        gutter={16}
        style={{
          height: "calc(100vh - 220px)",
          minHeight: 500,
          background: "#fff",
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          margin: 0,
        }}
      >
        {/* ── Conversation list ── */}
        <Col
          xs={24}
          sm={8}
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            borderRight: "1px solid #f0f0f0",
            padding: 0,
          }}
        >
          {/* Search */}
          <div style={{ padding: "14px 16px", borderBottom: "1px solid #f5f5f5" }}>
            <Input
              prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="Search vendors…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              allowClear
              style={{ borderRadius: 20 }}
            />
          </div>

          {/* List */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {loadingConvs ? (
              <div style={{ padding: 16 }}>
                {[1, 2, 3].map((n) => (
                  <Skeleton key={n} active avatar paragraph={{ rows: 1 }} style={{ marginBottom: 12 }} />
                ))}
              </div>
            ) : filteredConvs.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={search ? "No vendors match" : "No conversations yet"}
                style={{ margin: "40px auto" }}
              />
            ) : (
              filteredConvs.map((conv) => {
                const isActive = activeConv?._id === conv._id;
                const unread = conv.unreadByAdmin ?? 0;
                return (
                  <div
                    key={conv._id}
                    onClick={() => handleSelectConv(conv)}
                    style={{
                      padding: "12px 16px",
                      cursor: "pointer",
                      background: isActive ? "#f0f5ff" : "transparent",
                      borderLeft: isActive ? "3px solid #722ed1" : "3px solid transparent",
                      transition: "background 0.15s",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <Badge count={unread} size="small" offset={[-2, 2]}>
                      <Avatar
                        size={40}
                        style={{
                          background: isActive
                            ? "linear-gradient(135deg, #722ed1, #531dab)"
                            : "#d3adf7",
                          fontSize: 16,
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      >
                        {vendorInitial(conv)}
                      </Avatar>
                    </Badge>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Text
                          strong={unread > 0}
                          style={{
                            fontSize: 13,
                            color: isActive ? "#531dab" : "#1a1a1a",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: 120,
                            display: "block",
                          }}
                        >
                          {vendorName(conv)}
                        </Text>
                        {conv.lastMessageAt && (
                          <Text type="secondary" style={{ fontSize: 10, flexShrink: 0 }}>
                            {formatTime(conv.lastMessageAt)}
                          </Text>
                        )}
                      </div>
                      <Text
                        type="secondary"
                        style={{
                          fontSize: 12,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          display: "block",
                          fontWeight: unread > 0 ? 600 : 400,
                          color: unread > 0 ? "#595959" : undefined,
                        }}
                      >
                        {conv.lastMessage || "No messages yet"}
                      </Text>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Col>

        {/* ── Message panel ── */}
        <Col
          xs={24}
          sm={16}
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            padding: 0,
          }}
        >
          {!activeConv ? (
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 12,
                color: "#bfbfbf",
              }}
            >
              <CustomerServiceOutlined style={{ fontSize: 56 }} />
              <Text type="secondary" style={{ fontSize: 15 }}>
                Select a conversation to start replying
              </Text>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div
                style={{
                  padding: "14px 20px",
                  borderBottom: "1px solid #f0f0f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#fafafa",
                }}
              >
                <Space size={12}>
                  <Avatar
                    size={36}
                    style={{
                      background: "linear-gradient(135deg, #722ed1, #531dab)",
                      fontSize: 15,
                      fontWeight: 600,
                    }}
                  >
                    {vendorInitial(activeConv)}
                  </Avatar>
                  <div>
                    <Text strong style={{ fontSize: 14 }}>
                      {vendorName(activeConv)}
                    </Text>
                    {activeConv.vendorUser?.email && (
                      <Text type="secondary" style={{ fontSize: 12, display: "block" }}>
                        {activeConv.vendorUser.email}
                      </Text>
                    )}
                  </div>
                </Space>
                <Space>
                  <Tag color="purple" icon={<ShopOutlined />}>
                    Vendor
                  </Tag>
                  <Tooltip title="Refresh messages">
                    <Button
                      type="text"
                      size="small"
                      icon={<ReloadOutlined />}
                      onClick={() => fetchMessages(activeConv._id)}
                    />
                  </Tooltip>
                </Space>
              </div>

              {/* Messages */}
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  background: "#f7f8fc",
                  padding: "16px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                {loadingMsgs ? (
                  <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
                    <Spin size="large" />
                  </div>
                ) : messages.length === 0 ? (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="No messages in this conversation"
                    style={{ margin: "auto" }}
                  />
                ) : (
                  messages.map((msg, idx) => {
                    const isAdmin = msg.senderRole === "admin";
                    const prevMsg = messages[idx - 1];
                    const showDateSep =
                      idx === 0 ||
                      new Date(msg.createdAt).toDateString() !==
                        new Date(prevMsg?.createdAt).toDateString();

                    return (
                      <div key={msg._id ?? idx}>
                        {showDateSep && (
                          <div style={{ textAlign: "center", margin: "12px 0 8px", position: "relative" }}>
                            <Text
                              type="secondary"
                              style={{
                                fontSize: 11,
                                background: "#f7f8fc",
                                padding: "0 10px",
                                position: "relative",
                                zIndex: 1,
                              }}
                            >
                              {new Date(msg.createdAt).toLocaleDateString([], {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                              })}
                            </Text>
                            <div
                              style={{
                                position: "absolute",
                                top: "50%",
                                left: 0,
                                right: 0,
                                height: 1,
                                background: "#e8e8e8",
                                zIndex: 0,
                              }}
                            />
                          </div>
                        )}

                        <div
                          style={{
                            display: "flex",
                            flexDirection: isAdmin ? "row-reverse" : "row",
                            alignItems: "flex-end",
                            gap: 8,
                            marginBottom: 6,
                          }}
                        >
                          <Avatar
                            size={28}
                            icon={isAdmin ? <UserOutlined /> : <ShopOutlined />}
                            style={{
                              background: isAdmin ? "#f97316" : "#722ed1",
                              flexShrink: 0,
                            }}
                          />
                          <div style={{ maxWidth: "65%" }}>
                            <div
                              style={{
                                background: isAdmin
                                  ? "linear-gradient(135deg, #f97316 0%, #ea580c 100%)"
                                  : "#ffffff",
                                color: isAdmin ? "#fff" : "#1a1a1a",
                                borderRadius: isAdmin
                                  ? "16px 4px 16px 16px"
                                  : "4px 16px 16px 16px",
                                padding: "10px 14px",
                                boxShadow: isAdmin
                                  ? "0 2px 8px rgba(249,115,22,0.3)"
                                  : "0 1px 4px rgba(0,0,0,0.1)",
                                wordBreak: "break-word",
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 13,
                                  color: "inherit",
                                  lineHeight: 1.5,
                                  whiteSpace: "pre-wrap",
                                }}
                              >
                                {msg.body}
                              </Text>
                            </div>
                            <Text
                              type="secondary"
                              style={{
                                fontSize: 11,
                                display: "block",
                                marginTop: 3,
                                textAlign: isAdmin ? "right" : "left",
                                paddingRight: isAdmin ? 4 : 0,
                                paddingLeft: isAdmin ? 0 : 4,
                              }}
                            >
                              {formatTime(msg.createdAt)}
                            </Text>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div
                style={{
                  background: "#fff",
                  borderTop: "1px solid #f0f0f0",
                  padding: "12px 16px",
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-end",
                }}
              >
                <Input.TextArea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Reply to vendor… (Enter to send)"
                  autoSize={{ minRows: 1, maxRows: 4 }}
                  style={{
                    flex: 1,
                    borderRadius: 20,
                    resize: "none",
                    paddingLeft: 16,
                    paddingTop: 8,
                    paddingBottom: 8,
                    fontSize: 13,
                  }}
                />
                <Button
                  type="primary"
                  shape="circle"
                  size="large"
                  icon={<SendOutlined />}
                  onClick={handleSend}
                  loading={sending}
                  disabled={!text.trim()}
                  style={{
                    background: !text.trim()
                      ? undefined
                      : "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                    border: "none",
                    flexShrink: 0,
                  }}
                />
              </div>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default AdminChat;
