const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const axios = require('axios');
const {Temperament, Dog} = require('../db')

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

const getApiInfo = async () => {
    const apiUrl = await axios.get('https://api.thedogapi.com/v1/breeds');
    const apiInfo = await apiUrl.data.map(el => {
        return {
            name: el.name,
            weight: el.weight.metric,
            height: el.height.metric,
            life_span: el.life_span
        }
    });
    return apiInfo;
};

const getDbInfo = async () => {
    return await Dog.findAll({
        include:{
            model: Temperament,
            attributres: ['name'],
            throught: {
                attributres: []
            },
        }
    })
}


const getAllDogs = async () => {
    const apiInfo = await  getApiInfo();
    const DbInfo = await  getApiInfo();
    const infoTotal = apiInfo.concat(DbInfo);
    return infoTotal;
}

router.get('/dogs', async (req, res) => {
    const name = req.query.name;
    let dogsTotal = await getAllDogs();
    if (name) {
        let dogName = await dogsTotal.filter(el => el.name.toLowerCase().includes(name.toLowerCase()));
        dogName.length ?
        res.status(200).send(dogName) :
        res.status(404).send('La raza no se encuentra, Lo siento');
    }else{
        res.status(200).send(dogsTotal);
    }
})
// __GET /dogs__:
//   - Obtener un listado de las razas de perro
//   - Debe devolver solo los datos necesarios para la ruta principal

// - [ ] __GET /dogs?name="..."__:
//   - Obtener un listado de las razas de perro que contengan la palabra ingresada como query parameter
//   - Si no existe ninguna raza de perro mostrar un mensaje adecuado

// - [ ] __GET /dogs/{idRaza}__:
//   - Obtener el detalle de una raza de perro en particular
//   - Debe traer solo los datos pedidos en la ruta de detalle de raza de perro
//   - Incluir los temperamentos asociados

// - [ ] __POST /dogs__:
//   - Recibe los datos recolectados desde el formulario controlado de la ruta de creación de raza de perro por body
//   - Crea una raza de perro en la base de datos relacionada con sus temperamentos

// - [ ] __GET /temperaments__:
//   - Obtener todos los temperamentos posibles
//   - En una primera instancia deberán obtenerlos desde la API externa y guardarlos en su propia base de datos y luego ya utilizarlos desde allí

module.exports = router;
