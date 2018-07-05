import faker from "faker";

const data = Array(400).fill().map(((_, i) => ({
    id: i,
    name: faker.name.firstName(),
})));

const router = (app, config) => {
    let timeout = null;
    const tryDelay = action => {
        timeout && clearInterval(timeout);
        config && config.delay && action
            ? timeout = setTimeout(() => action(), config.delay)
            : action()
    };
    app.get("/", (_req, res) => (
        tryDelay(() => res.status(200).send("/"))
    )),
    app.get("/contacts", (_req, res) => {
        const results = Array(50).fill().map(((_, i) => ({
            id: i,
            name: faker.name.firstName(),
        })));
        res.status(200);
        tryDelay(() => res.send({
            count: results.length,
            results,
        }));
    })
};

export default router;