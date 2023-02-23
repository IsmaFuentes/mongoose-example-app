const mongoose = require('mongoose');
const prompt = require('prompt-sync')();
const models = require('./models');

const connectionString = 'mongodb://localhost:27017/taller-db';

mongoose.Promise = global.Promise;
mongoose.set('strictQuery', false);
mongoose.connect(connectionString, { autoIndex: true });

mongoose.connection.on('error', function (err) {
  console.log(`MongoDB connection has occured ${err} error`);
});

mongoose.connection.on('disconnected', function () {
  console.log('MongoDB connection is disconnected ');
});

mongoose.connection.on('connected', function () {
  console.log('MongoDB connection is open.');
  startApp();
});

const startApp = async () => {
  let p = prompt('Crear demo data? y/n: ');

  if (p === 'y') {
    await createDemoData();
  }

  while (true) {
    console.log('\n1 - Mostrar lista de vehículos');
    console.log('2 - Mostrar lista de empleados');
    console.log('3 - Dar de alta un empleado');
    console.log('4 - Mostrar lista de productos');
    console.log('5 - Añadir una revisión');
    console.log('6 - Crear una factura');
    console.log('0 - Salir\n');

    const n = Number(prompt('¿que acción quieres realizar?: '));

    if (!isNaN(n)) {
      if (n === 1) {
        // mostrar lista de vehículos
        let data = await mongoose.model('Vehicle').find({}).populate('revisions.employee');
        console.log(JSON.stringify(data, null, 2));
      }

      if (n === 2) {
        // mostrar lista de empleados
        let data = await mongoose.model('Employee').find({});
        console.log(JSON.stringify(data, null, 2));
      }

      if (n === 3) {
        // dar de alta empleados
        let name = prompt('Nombre: ');
        let surnames = prompt('Apellidos: ');
        let dni = prompt('DNI: ');
        let date = prompt('Fecha nacimiento: ');

        if (isNaN(Date.parse(date)) === false) {
          await mongoose
            .model('Employee')
            .create({ name, surnames, identificationNumber: dni, birthdate: date })
            .then((emp) => console.log(JSON.stringify(emp, null, 2)))
            .catch((err) => console.log(err));
        } else {
          console.log('¡Fecha inválida!');
        }
      }

      if (n === 4) {
        // mostrar lista de productos
        let data = await mongoose.model('Product').find({});
        console.log(JSON.stringify(data, null, 2));
      }

      if (n === 5) {
        // añadir revisión a un vehículo
        let vehicleId = prompt('Id del vehículo: ');
        let employeeId = prompt('Id del encargado: ');
        let kms = Number(prompt('Kilometros del coche: '));
        let observations = prompt('Observaciones: ');

        await mongoose
          .model('Vehicle')
          .findByIdAndUpdate(
            vehicleId,
            {
              $push: { revisions: { kilometers: kms, employee: employeeId, observations } },
            },
            { new: true, runValidators: true }
          )
          .populate('revisions.employee')
          .then((updated) => console.log(JSON.stringify(updated, null, 2)));
      }

      if (n === 6) {
        // generar factura (autogenerada a partir de la lista de productos)
        const products = await mongoose.model('Product').find({}).lean();
        const baseAmount = products.reduce((acc, prod) => acc + prod.price, 0);
        const totalAmount = baseAmount * 1.21;
        const taxAmount = totalAmount - baseAmount;

        const invoice = {
          identificationNumber: 'F-0012345',
          baseAmount,
          taxAmount,
          totalAmount,
          breakdown: products.map((prod) => {
            return {
              product: prod._id,
              description: prod.description,
              unitAmount: prod.price,
              quantity: 1,
            };
          }),
        };

        await mongoose
          .model('Invoice')
          .create(invoice)
          .then((data) => console.log(JSON.stringify(data, null, 2)))
          .catch((err) => console.log(`[ERROR]: ${err.message}`));
      }

      if (n === 0) {
        // salir
        process.exit(0);
      }
    }
  }
};

const createDemoData = async () => {
  const { employees, products, vehicles } = require('./data');
  // Ejecuta las consultas en paralelo y espera a que finalizen
  const results = await Promise.allSettled([
    models.Employee.create(employees),
    models.Product.create(products),
    models.Vehicle.create(vehicles),
  ]);

  results.forEach((result) => {
    if (result.status === 'rejected') {
      console.log(`[ERROR]: ${result.reason.message}`);
    }
  });
};
