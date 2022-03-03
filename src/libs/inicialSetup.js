import Role from '../models/rol'
export const createRol = async () => {
    try {
        const count = await Role.estimatedDocumentCount()

        if (count > 0) return;

        const values = await Promise.all([
            new Role({ name: 'Dueño' }).save(),
            new Role({ name: 'Ventas' }).save(),
            new Role({ name: 'Recepción' }).save()
        ])
    } catch (error) {
        console.error(error);
    }

};