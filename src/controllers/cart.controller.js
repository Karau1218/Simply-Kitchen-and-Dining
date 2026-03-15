export const getCart = (req, res) => {

    if (!req.session.cart) {
        req.session.cart = []
    }

    res.json({ items: req.session.cart })
}

export const addCartItem = (req, res) => {
    const { productId } = req.body
    if (!req.session.cart) {
        req.session.cart = []
    }

    const existing = req.session.cart.find(
        item => item.productId === productId
    )
    if (existing) {
        existing.quantity += 1
    } else {
        req.session.cart.push({
            productId,
            quantity: 1
        })
    }

    res.json({ items: req.session.cart })
}

export const removeCartItem = (req, res) => {
    const productId = parseInt(req.params.productId)

    if (!req.session.cart) {
        req.session.cart = []
    }

    req.session.cart = req.session.cart.filter(
        item => item.productId !== productId
    )

    res.json({ items: req.session.cart })
}

export const clearCart = (req, res) => {
    req.session.cart = []
    res.json({ items: [] })
}

export const decreaseCartItem = (req, res) => {
    const productId = Number(req.params.productId)

    if (!req.session.cart) {
        req.session.cart = []
    }

    const existingItem = req.session.cart.find(
        (item) => Number(item.productId) === productId
    )

    if (!existingItem) {
        return res.json({ items: req.session.cart })
    }

    existingItem.quantity -= 1

    if (existingItem.quantity <= 0) {
        req.session.cart = req.session.cart.filter(
            (item) => Number(item.productId) !== productId
        )
    }

    res.json({ items: req.session.cart })
}