import faker from "faker";

const router = (app, config) => {
    const fakeData = Array(400).fill().map(((_, i) => ({
        id: i+1,
        name: faker.company.companyName(),
        email: faker.internet.email(),
        phone: faker.phone.phoneNumber(),
        address: faker.fake("{{address.streetAddress}}, {{address.city}}, {{address.zipCode}}"),
        company_reg_id: "123456",
        tax_id: "123456",
        account_number: "12345678",
        sort_code: "123456",
        bank_name: faker.company.companySuffix(),
        notes: faker.lorem.sentence(),
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
    const getPage = (data, page) => {
        const pageLimit = config && config.pageLimit ? config.pageLimit : 10;
        return data.slice((pageLimit * page) - pageLimit, pageLimit * page);
    }
    const getFiltered = (data, query) => {
        return data.filter(item => item.name.toLowerCase().startsWith(query.toLowerCase()));
    }
    app.get("/", (_req, res) => (
        tryDelay(() => res.status(200).send("/"))
    ));
    app.get("/contacts", (req, res) => {
        let results = fakeData;
        if (req.query.q) {
            results = getFiltered(results, req.query.q);
        }
        if (req.query.page) {
            results = getPage(results, req.query.page);    
        }
        if (req.query.limit) {
            results = results.slice(0, req.query.limit);
        }
        if (results.length) {
            tryDelay(() => res.status(200).send({
                count: fakeData.length,
                results,
            }));
        } else {
            tryDelay(() => res.status(404).send({
                message: "No results."
            }));
        }
    });
    app.get("/contacts/:id", (req, res) => {
        const id = req.params.id;
        if (isFinite(id) && id > 0) {
            const match = fakeData.find(item => item.id === parseInt(id, 10));
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