const skeletonController = require("../controllers/skeletonController");
//Los describe reciben como primer parámetro una descripción y como segunda una función
describe("util-skeleton-api", () => {
    describe("controllers", () => {
        describe("skeletonControllers.getVersionId", () => {
            /* 1 param descripción, 2 función*/
            it("return version", () => {
                const axios = {
                    /* MockResolvedValue va a indicar que get va a devolver una promesa,
                    pero esta promesa va a resolver en un valor en particular que nosotros le vamos a indicar*/
                    get: jest.fn().mockResolvedValue({}),
                };

                const res = {
                    //Cuando nosotros ejecutemos status nos vamos a asegurar de que va a retornar res
                    status: jest.fn().mockReturnThis(),
                    send: jest.fn(),
                };
                skeletonController.getVersionId({}, res, {});
                console.log("Código de estado: ", res.status.mock.calls);
                expect(res.status.mock.calls).toEqual([[200], [400]]);
            });
        });
    });
});
