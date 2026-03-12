export function requireAuthPage(req, res, next) {
 if (req.session && req.session.user) {
  return next()
 }

 return res.redirect("/login")
}

export function requireAuthApi(req, res, next) {
 if (req.session && req.session.user) {
  return next()
 }

 return res.status(401).json({ error: "Unauthorized" })
}