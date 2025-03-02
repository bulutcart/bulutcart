
const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";
class MiddleWare{
    constructor(jwt, db){
        this.jwt = jwt;
        this.db = db;
    }
    isPublic = (req, res, next) => {
        next();
    };
    isManager = (req, res, next) => {
        const token = req.header("Authorization")?.split(" ")[1];
        if (!token) return res.status(403).json({ error: "Access denied" });
        this.jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) return res.status(403).json({ error: "Invalid token: " + err  });
            if(user.role !== "manager")  return res.status(403).json({ error: "Access denied your is not manager" });
            req.user = user;
            next();
        });
    };
    isSeller = (req, res, next) => {
        const token = req.header("Authorization")?.split(" ")[1];
        if (!token) return res.status(403).json({ error: "Access denied" });
        this.jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) return res.status(403).json({ error: "Invalid token: " + err  });
            if(user.access !== "seller")  return res.status(403).json({ error: "Access denied your is not seller" });
            req.user = user;
            next();
        });
    };
    isCustomer = (req, res, next) => {
        const token = req.header("Authorization")?.split(" ")[1];
        if (!token) return res.status(403).json({ error: "Access denied" });
        this.jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) return res.status(403).json({ error: "Invalid token: " + err  });
            if(user.access !== "customer")  return res.status(403).json({ error: "Access denied your is not customer" });
            req.user = user;
            next();
        });
    };
    hasValidToken = (req, res, next) => {
        const token = req.cookies.bulutToken
        if (!token) return res.redirect("/login");
        this.jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) return res.redirect("/login");
            next();
        });
    };
    static getEndpoint(service){
        return process.env[service.toUpperCase() + '_ENDPOINT']
    }
}
module.exports = MiddleWare;