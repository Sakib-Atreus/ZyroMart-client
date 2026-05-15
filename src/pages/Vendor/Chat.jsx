import { useEffect, useRef, useState, useCallback } from "react";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Empty,
  Input,
  Skeleton,
  Space,
  Spin,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import {
  ReloadOutlined,
  SendOutlined,
  CustomerServiceOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { chatApi } from "../../api/endpoints";

const { Text, Paragraph, Title } = Typography;
const POLL_INTERVAL = 5000;

const formatTime = (d) => {
  if (!d) return "";
  const date = new Date(d);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return date.toLocaleDateString([], { month: "short", day: "numeric" }) +
    " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const VendorChat = () => {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingInit, setLoadingInit] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [unreadByVendor, setUnreadByVendor] = useState(0);

  const bottomRef = useRef(null);
  const pollRef = useRef(null);
  const convIdRef = useRef(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = useCallback(async (convId, silent = false) => {
    if (!convId) return;
    if (!silent) setLoadingMsgs(true);
    try {
      const res = await chatApi.getMessages(convId);
      const msgs = res.data ?? res ?? [];
      setMessages(Array.isArray(msgs) ? msgs : []);
      // After fetching, unread is reset by server
      setUnreadByVendor(0);
    } catch (err) {
      if (!silent) setError(err.message || "Failed to load messages");
    } finally {
      if (!silent) setLoadingMsgs(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await chatApi.myConversation();
        const conv = res.data ?? res;
        if (conv?._id) {
          setConversation(conv);
          setUnreadByVendor(conv.unreadByVendor ?? 0);
          convIdRef.current = conv._id;
          await fetchMessages(conv._id);
        }
      } catch (err) {
        if (err?.response?.status !== 404) {
          setError(err.message || "Failed to load conversation");
        }
      } finally {
        setLoadingInit(false);
      }
    };
    init();
  }, [fetchMessages]);

  // Poll for new messages every 5s
  useEffect(() => {
    pollRef.current = setInterval(() => {
      if (convIdRef.current) fetchMessages(convIdRef.current, true);
    }, POLL_INTERVAL);
    return () => clearInterval(pollRef.current);
  }, [fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setSending(true);
    try {
      const res = await chatApi.sendMessage({ body: trimmed });
      const newMsg = res.data ?? res;
      setText("");

      if (!convIdRef.current) {
        // First message — conversation just created
        const convRes = await chatApi.myConversation();
        const conv = convRes.data ?? convRes;
        setConversation(conv);
        convIdRef.current = conv._id;
        await fetchMessages(conv._id);
      } else {
        setMessages((prev) => [...prev, newMsg]);
        setTimeout(scrollToBottom, 50);
      }
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

  if (loadingInit) {
    return (
      <div style={{ padding: 32 }}>
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  return (
    <div style={{ height: "calc(100vh - 160px)", minHeight: 500, display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Header */}
      <div
        style={{
          background: "#fff",
          borderRadius: "12px 12px 0 0",
          borderBottom: "1px solid #f0f0f0",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <Space size={12}>
          <Avatar
            size={40}
            icon={<CustomerServiceOutlined />}
            style={{ background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)" }}
          />
          <div>
            <Title level={5} style={{ margin: 0, lineHeight: 1.2 }}>ZyroMart Support</Title>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {conversation ? (
                <Badge status="processing" text="Active" style={{ fontSize: 12 }} />
              ) : "Start a conversation"}
            </Text>
          </div>
        </Space>
        <Space>
          {unreadByVendor > 0 && (
            <Tag color="orange">{unreadByVendor} new</Tag>
          )}
          <Tooltip title="Refresh messages">
            <Button
              type="text"
              icon={<ReloadOutlined />}
              onClick={() => fetchMessages(convIdRef.current)}
              disabled={!convIdRef.current}
            />
          </Tooltip>
        </Space>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          showIcon
          closable
          onClose={() => setError(null)}
          style={{ borderRadius: 0 }}
        />
      )}

      {/* Messages area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          background: "#f7f8fc",
          padding: "20px 24px",
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
            description={
              <span>
                No messages yet.{" "}
                <Text type="secondary">Send your first message below.</Text>
              </span>
            }
            style={{ margin: "auto", paddingTop: 60 }}
          />
        ) : (
          <>
            {messages.map((msg, idx) => {
              const isVendor = msg.senderRole === "vendor";
              const prevMsg = messages[idx - 1];
              const showDateSep =
                idx === 0 ||
                new Date(msg.createdAt).toDateString() !==
                  new Date(prevMsg?.createdAt).toDateString();

              return (
                <div key={msg._id ?? idx}>
                  {showDateSep && (
                    <div
                      style={{
                        textAlign: "center",
                        margin: "12px 0 8px",
                        position: "relative",
                      }}
                    >
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
                      flexDirection: isVendor ? "row-reverse" : "row",
                      alignItems: "flex-end",
                      gap: 8,
                      marginBottom: 6,
                    }}
                  >
                    <Avatar
                      size={28}
                      icon={isVendor ? <ShopOutlined /> : <CustomerServiceOutlined />}
                      style={{
                        background: isVendor ? "#722ed1" : "#f97316",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ maxWidth: "65%" }}>
                      <div
                        style={{
                          background: isVendor
                            ? "linear-gradient(135deg, #722ed1 0%, #531dab 100%)"
                            : "#ffffff",
                          color: isVendor ? "#fff" : "#1a1a1a",
                          borderRadius: isVendor
                            ? "16px 4px 16px 16px"
                            : "4px 16px 16px 16px",
                          padding: "10px 14px",
                          boxShadow: isVendor
                            ? "0 2px 8px rgba(114,46,209,0.3)"
                            : "0 1px 4px rgba(0,0,0,0.1)",
                          wordBreak: "break-word",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
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
                          textAlign: isVendor ? "right" : "left",
                          paddingRight: isVendor ? 4 : 0,
                          paddingLeft: isVendor ? 0 : 4,
                        }}
                      >
                        {formatTime(msg.createdAt)}
                      </Text>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div
        style={{
          background: "#fff",
          borderTop: "1px solid #f0f0f0",
          borderRadius: "0 0 12px 12px",
          padding: "14px 20px",
          display: "flex",
          gap: 10,
          alignItems: "flex-end",
          boxShadow: "0 -1px 4px rgba(0,0,0,0.04)",
        }}
      >
        <Input.TextArea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message… (Enter to send, Shift+Enter for new line)"
          autoSize={{ minRows: 1, maxRows: 5 }}
          style={{
            flex: 1,
            borderRadius: 20,
            resize: "none",
            paddingLeft: 16,
            paddingRight: 16,
            paddingTop: 8,
            paddingBottom: 8,
            fontSize: 14,
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
            background: !text.trim() ? undefined : "linear-gradient(135deg, #722ed1 0%, #531dab 100%)",
            border: "none",
            flexShrink: 0,
          }}
        />
      </div>
    </div>
  );
};

export default VendorChat;
