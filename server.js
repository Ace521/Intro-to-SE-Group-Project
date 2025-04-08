const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());

// PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

let users = [
    { id: 1, username: "admin", role: "admin" },
    { id: 2, username: "user123", role: "buyer" },
    { id: 3, username: "testuser", role: "seller" }
];
// Delete account route
app.delete('/delete-account', (req, res) => {
    const { userId } = req.body;
    const requesterRole = req.headers['x-role']; // In real case, use session/auth

    if (requesterRole !== 'admin') {
        return res.status(403).json({ success: false, message: 'Only admins can delete accounts.' });
    }

    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ success: false, message: 'User not found.' });
    }

    users.splice(userIndex, 1); // Delete user
    return res.json({ success: true, message: 'Account deleted.' });
});
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Logout failed' });
        }
        res.clearCookie('connect.sid'); // Optional: clear cookie
        return res.json({ success: true, message: 'Logged out successfully' });
    });
});
app.use(express.static(path.join(__dirname, 'public')));
