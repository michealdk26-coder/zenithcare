
(function() {
    const widgetHTML = `
        <style>
            #aiChatWidget { position: fixed; bottom: 20px; right: 20px; z-index: 9999; font-family: Arial, sans-serif; }
            #chatButton { width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; font-size: 28px; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.3); transition: transform 0.2s; }
            #chatButton:hover { transform: scale(1.1); }
            #chatBox { display: none; position: fixed; bottom: 90px; right: 20px; width: 350px; height: 500px; background: white; border-radius: 15px; box-shadow: 0 5px 25px rgba(0,0,0,0.3); flex-direction: column; overflow: hidden; }
            #chatBox.open { display: flex; }
            #chatHeader { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px; font-weight: bold; display: flex; justify-content: space-between; align-items: center; }
            #closeChat { background: none; border: none; color: white; font-size: 24px; cursor: pointer; }
            #chatMessages { flex: 1; overflow-y: auto; padding: 15px; background: #f5f5f5; }
            .message { margin-bottom: 12px; padding: 10px 15px; border-radius: 12px; max-width: 85%; word-wrap: break-word; }
            .user-message { background: #667eea; color: white; margin-left: auto; text-align: right; }
            .bot-message { background: white; color: #333; }
            #chatInputArea { display: flex; padding: 10px; background: white; border-top: 1px solid #ddd; }
            #chatInput { flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 20px; outline: none; }
            #sendBtn { margin-left: 8px; padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 20px; cursor: pointer; font-weight: bold; }
            #sendBtn:hover { background: #764ba2; }
            .typing { font-style: italic; color: #999; }
        </style>

        <div id="aiChatWidget">
            <button id="chatButton" title="Ask AI Assistant">💬</button>
            <div id="chatBox">
                <div id="chatHeader">
                    🤖 AI Medical Assistant
                    <button id="closeChat">×</button>
                </div>
                <div id="chatMessages">
                    <div class="message bot-message">👋 Hi! I'm your AI medical assistant. Ask me anything about health, symptoms, or general medical advice!</div>
                </div>
                <div id="chatInputArea">
                    <input type="text" id="chatInput" placeholder="Type your question..." />
                    <button id="sendBtn">Send</button>
                </div>
            </div>
        </div>
    `;

    document.addEventListener('DOMContentLoaded', function() {
        document.body.insertAdjacentHTML('beforeend', widgetHTML);

        const chatButton = document.getElementById('chatButton');
        const chatBox = document.getElementById('chatBox');
        const closeChat = document.getElementById('closeChat');
        const chatInput = document.getElementById('chatInput');
        const sendBtn = document.getElementById('sendBtn');
        const chatMessages = document.getElementById('chatMessages');

        chatButton.addEventListener('click', function() {
            chatBox.classList.add('open');
            chatInput.focus();
        });

        closeChat.addEventListener('click', function() {
            chatBox.classList.remove('open');
        });

        async function sendMessage() {
            const question = chatInput.value.trim();
            if (!question) return;

            addMessage(question, 'user');
            chatInput.value = '';

            const typingMsg = addMessage('AI is thinking...', 'bot', 'typing');

            try {
                const response = await fetch('http://localhost:5001/ask', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ question: question })
                });

                const data = await response.json();

                typingMsg.remove();

                if (data.success) {
                    addMessage(data.answer, 'bot');
                } else {
                    addMessage('Sorry, something went wrong. Try again!', 'bot');
                }
            } catch (error) {
                typingMsg.remove();
                addMessage('⚠️ Cannot connect to AI. Make sure the backend is running on port 5001.', 'bot');
            }
        }

        function addMessage(text, type, className = '') {
            const msgDiv = document.createElement('div');
            msgDiv.className = `message ${type}-message ${className}`;
            msgDiv.textContent = text;
            chatMessages.appendChild(msgDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            return msgDiv;
        }

        sendBtn.addEventListener('click', sendMessage);

        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    });
})();
