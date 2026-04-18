import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight, Clock, MessageCircle, X } from "lucide-react";
import { sendChatMessage } from "../services/api";

export default function SidebarChat({ onClose, context = {} }) {
	const [messages, setMessages] = useState([
		{
			role: "assistant",
			content: "Ask me about your result, what the risk level means, or how to interpret the risk factors.",
		},
	]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const endRef = useRef(null);

	const summary = useMemo(() => {
		const riskLevel = context.riskLevel || "Moderate";
		const probability = context.probability ?? "N/A";
		return `${riskLevel} risk, ${probability}% probability`;
	}, [context.probability, context.riskLevel]);

	useEffect(() => {
		endRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, loading]);

	async function handleSend() {
		const trimmed = input.trim();
		if (!trimmed || loading) {
			return;
		}

		const nextMessages = [...messages, { role: "user", content: trimmed }];
		setMessages(nextMessages);
		setInput("");
		setLoading(true);
		setError(null);

		try {
			const response = await sendChatMessage({
				message: trimmed,
				messages,
				context,
			});

			setMessages(prev => [...prev, { role: "assistant", content: response.reply }]);
		} catch (err) {
			setError(err.message);
			setMessages(prev => [...prev, {
				role: "assistant",
				content: `I could not reach the AI assistant: ${err.message}`,
			}]);
		} finally {
			setLoading(false);
		}
	}

	function handleKeyDown(event) {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			handleSend();
		}
	}

	return (
		<>
			<div onClick={onClose} style={{
				position: "fixed", inset: 0, zIndex: 40,
				background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
			}} />
			<div style={{
				position: "fixed", right: 0, top: 0, bottom: 0, zIndex: 50,
				width: "min(440px, 100vw)",
				background: "rgba(15,18,40,0.98)",
				borderLeft: "1px solid rgba(255,255,255,0.1)",
				backdropFilter: "blur(20px)",
				display: "flex", flexDirection: "column",
				boxShadow: "-20px 0 60px rgba(0,0,0,0.4)",
			}}>
				<div style={{
					display: "flex", alignItems: "center", justifyContent: "space-between",
					padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)",
				}}>
					<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
						<div style={{
							width: "34px", height: "34px", borderRadius: "10px",
							background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.3)",
							display: "flex", alignItems: "center", justifyContent: "center",
						}}>
							<MessageCircle size={17} color="#818cf8" />
						</div>
						<div>
							<p style={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem" }}>AI Assistant</p>
							<p style={{ color: "#4a5568", fontSize: "0.72rem" }}>{summary}</p>
						</div>
					</div>
					<button onClick={onClose} style={{
						background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
						borderRadius: "8px", width: "32px", height: "32px",
						display: "flex", alignItems: "center", justifyContent: "center",
						color: "#7a8494", cursor: "pointer", transition: "all 200ms",
					}}
						onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#fff"; }}
						onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#7a8494"; }}
					>
						<X size={15} />
					</button>
				</div>

				<div style={{
					flex: 1, display: "flex", flexDirection: "column",
					gap: "14px", padding: "20px 20px 16px",
					overflowY: "auto",
				}}>
					<div style={{
						background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.18)",
						borderRadius: "14px", padding: "14px 16px",
					}}>
						<p style={{ color: "#6366f1", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "6px" }}>
							Context
						</p>
						<p style={{ color: "#c7d2fe", fontSize: "0.86rem", lineHeight: 1.6 }}>
							I can explain your prediction, walk through risk factors, and suggest next questions to ask a clinician.
						</p>
					</div>

					{messages.map((message, index) => (
						<div key={index} style={{
							alignSelf: message.role === "user" ? "flex-end" : "flex-start",
							maxWidth: "88%",
							background: message.role === "user" ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.05)",
							border: message.role === "user" ? "1px solid rgba(99,102,241,0.35)" : "1px solid rgba(255,255,255,0.08)",
							borderRadius: message.role === "user" ? "16px 16px 6px 16px" : "16px 16px 16px 6px",
							padding: "12px 14px",
						}}>
							<p style={{ color: message.role === "user" ? "#e0e7ff" : "#fff", fontSize: "0.9rem", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
								{message.content}
							</p>
						</div>
					))}

					{loading && (
						<div style={{
							alignSelf: "flex-start",
							background: "rgba(255,255,255,0.05)",
							border: "1px solid rgba(255,255,255,0.08)",
							borderRadius: "16px 16px 16px 6px",
							padding: "12px 14px",
						}}>
							<p style={{ color: "#b0b9d4", fontSize: "0.9rem" }}>Thinking...</p>
						</div>
					)}

					<div ref={endRef} />
				</div>

				<div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
					{error && (
						<div style={{
							marginBottom: "12px",
							background: "rgba(239,68,68,0.08)",
							border: "1px solid rgba(239,68,68,0.22)",
							borderRadius: "10px",
							padding: "10px 12px",
						}}>
							<p style={{ color: "#fca5a5", fontSize: "0.78rem" }}>{error}</p>
						</div>
					)}

					<div style={{
						display: "flex", alignItems: "center", gap: "10px",
						background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
						borderRadius: "12px", padding: "12px 14px",
					}}>
						<textarea
							value={input}
							onChange={event => setInput(event.target.value)}
							onKeyDown={handleKeyDown}
							rows={1}
							placeholder="Ask about your risk result..."
							style={{
								flex: 1, resize: "none", background: "none", border: "none", outline: "none",
								color: "#fff", fontSize: "0.875rem", lineHeight: 1.5, minHeight: "24px",
								maxHeight: "110px",
							}}
						/>
						<button
							type="button"
							onClick={handleSend}
							disabled={loading || !input.trim()}
							style={{
								width: "36px", height: "36px", borderRadius: "10px",
								border: "1px solid rgba(99,102,241,0.35)",
								background: loading || !input.trim() ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.35)",
								display: "flex", alignItems: "center", justifyContent: "center",
								cursor: loading || !input.trim() ? "not-allowed" : "pointer",
							}}
						>
							<ChevronRight size={16} color="#e0e7ff" />
						</button>
					</div>

					<div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "10px" }}>
						<Clock size={13} color="#f59e0b" />
						<p style={{ color: "#7a8494", fontSize: "0.72rem" }}>
							The assistant is connected to the backend LLM endpoint.
						</p>
					</div>
				</div>
			</div>
		</>
	);
}
