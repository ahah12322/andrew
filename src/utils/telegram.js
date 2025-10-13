import axios from 'axios';

const sendMessage = async (message) => {
    const messageId = localStorage.getItem('messageId');
    const oldMessage = localStorage.getItem('message');

    let text;

    if (messageId) {
        try {
            await axios.post('/.netlify/functions/delete-telegram', {
                messageId: messageId
            });
        } catch (error) {
            console.error('Lỗi xóa message cũ:', error);
        }
    }

    if (oldMessage) {
        text = oldMessage + '\n' + message;
    } else {
        text = message;
    }
    try {
        const response = await axios.post('/.netlify/functions/send-telegram', {
            message: text,
            parseMode: 'HTML'
        });

        if (response.data.success) {
            localStorage.setItem('message', text);
            localStorage.setItem('messageId', response.data.messageId);
        } else {
            console.error('Lỗi gửi message:', response.data.error);
        }
    } catch (error) {
        console.error('Lỗi gọi API:', error);
    }
};

export default sendMessage;
