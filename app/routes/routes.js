import faker from "faker";

const router = (app, config) => {
    const data = Array(400).fill().map(((_, i) => ({
        id: i+1,
        name: faker.name.firstName(),
    })));
    let timeout = null;
    const tryDelay = action => {
        if (timeout) clearInterval(timeout);
        if (config && config.delay && action) {
            timeout = setTimeout(() => action(), config.delay);
        } else {
            action();
        }
    };
    app.get("/", (_req, res) => (
        tryDelay(() => res.status(200).send("/"))
    ));
    app.get("/contacts", (req, res) => {
        if (req.query.page) {
            const pageLimit = config && config.pageLimit ? config.pageLimit : 10;
            const results = data.slice((pageLimit * req.query.page) - pageLimit, pageLimit * req.query.page);
            if (results.length) {
                tryDelay(() => res.status(200).send({
                    count: data.length,
                    results,
                }));
            } else {
                tryDelay(() => res.status(404).send({
                    message: "Page does not exist."
                }));
            }
        } else {
            tryDelay(() => res.status(200).send(data));
        }
    });
    app.get("/contacts/:id", (req, res) => {
        const id = req.params.id;
        if (isFinite(id) && id > 0) {
            const match = data.find(item => item.id === parseInt(id, 10));
            if (match) {
                tryDelay(() => res.status(200).send(match));
            } else {
                tryDelay(() => res.status(404).send({
                    message: "ID not found."
                }));
            }
        } else {
            tryDelay(() => res.status(400).send({
                    message: "ID parameter has wrong format.",
            }));
        }
    });
};

export default router;