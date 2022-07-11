module.exports = (req, res, next) => {
    const validEmail = (email) => {
        let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/;
        let isRegexTrue = emailRegex.test(email);
        isRegexTrue ? next() : res.status(400).json({ message: "Invalid email" });
    }
    validEmail(req.body.email);
}