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
    console.log('3 - Mostrar lista de productos');
    console.log('4 - Añadir una revisión');
    console.log('5 - Crear una factura');
    console.log('0 - Salir\n');

    const n = Number(prompt('¿que acción quieres realizar?: '));

    if (!isNaN(n)) {
      if (n === 1) {
        let data = await mongoose.model('Vehicle').find({}).populate('revisions.employee');
        console.log(JSON.stringify(data, null, 2));
      }

      if (n === 2) {
        let data = await mongoose.model('Employee').find({});
        console.log(JSON.stringify(data, null, 2));
      }

      if (n === 3) {
        let data = await mongoose.model('Product').find({});
        console.log(JSON.stringify(data, null, 2));
      }

      if (n === 4) {
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

      if (n === 5) {
        // factura autogenerada a partir de la lista de productos
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
