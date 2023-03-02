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

const prettyPrint = (data) => console.log(JSON.stringify(data, null, 2));

const startApp = async () => {
  let p = prompt('Crear demo data? y/n: ');

  if (p === 'y') {
    await createDemoData();
  }

  while (true) {
    console.log('\n1 - Vehículos');
    console.log('2 - Empleados');
    console.log('3 - Productos');
    console.log('4 - Facturas');
    console.log('5 - Salir\n');

    let n = Number(prompt('Selecciona una categoría: '));

    if (n === 1) {
      // VEHÍCULOS
      await vehicleActions();
    }

    if (n === 2) {
      // EMPLEADOS
      await employeeActions();
    }

    if (n === 3) {
      // PRODUCTOS
      await productActions();
    }

    if (n === 4) {
      // FACTURAS
      await invoiceActions();
    }

    if (n === 5) {
      process.exit(0);
    }
  }
};

const invoiceActions = async () => {
  while (true) {
    console.log('\n1 - Lista\n2 - Generar\n3 - Borrar\n4 - Atrás\n');

    let action = Number(prompt('Selecciona una acción: '));

    if (action === 1) {
      // Lista
      const invoices = await mongoose.model('Invoice').find({});
      prettyPrint(invoices);
    }

    if (action === 2) {
      // Autogenerar factura
      const products = await mongoose.model('Product').find({}).lean();
      const baseAmount = products.reduce((acc, prod) => acc + prod.price, 0);
      const totalAmount = baseAmount * 1.21;
      const taxAmount = totalAmount - baseAmount;

      const invoice = {
        identificationNumber: `F-${Math.floor(Math.random() * 9999)}`,
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

    if (action === 3) {
      // Borrar
      const id = prompt(' - ID: ');
      await mongoose
        .model('Invoice')
        .findByIdAndRemove(id)
        .then(() => console.log('documento eliminado'))
        .catch((err) => console.log(err));
    }

    if (action === 4) {
      break;
    }
  }
};

const productActions = async () => {
  while (true) {
    console.log('\n1 - Lista\n2 - Crear\n3 - Actualizar\n4 - Borrar\n5 - Atrás\n');

    let action = Number(prompt('Selecciona una acción: '));

    if (action === 1) {
      // Lista
      const products = await mongoose.model('Product').find({});
      prettyPrint(products);
    }

    if (action === 2) {
      // Crear
      const product = {
        code: prompt(' - Código: '),
        description: prompt(' - Descripción: '),
        price: Number(prompt(' - Precio: ')),
      };

      await mongoose
        .model('Product')
        .create(product)
        .then((document) => prettyPrint(document))
        .catch((err) => console.log(err));
    }

    if (action === 3) {
      // Actualizar
      const id = prompt(' - ID: ');
      const product = {
        code: prompt(' - Código: '),
        description: prompt(' - Descripción: '),
        price: Number(prompt(' - Precio: ')),
      };

      await mongoose
        .model('Product')
        .findByIdAndUpdate(id, product, { runValidators: true, new: true })
        .then((document) => prettyPrint(document))
        .catch((err) => console.log(err));
    }

    if (action === 4) {
      // Borrar
      const id = prompt(' - ID: ');
      await mongoose
        .model('Product')
        .findByIdAndRemove(id)
        .then(() => console.log('documento eliminado'))
        .catch((err) => console.log(err));
    }

    if (action === 5) {
      console.log('quit');
      break;
    }
  }
};

const employeeActions = async () => {
  while (true) {
    console.log('\n1 - Lista\n2 - Crear\n3 - Actualizar\n4 - Borrar\n5 - Atrás\n');

    let action = Number(prompt('Selecciona una acción: '));

    if (action === 1) {
      // Lista
      const employees = await mongoose.model('Employee').find({});
      prettyPrint(employees);
    }

    if (action === 2) {
      // Crear
      const employee = {
        name: prompt(' - Nombre: '),
        surnames: prompt(' - Apellidos: '),
        identificationNumber: prompt(' - DNI: '),
        birthdate: prompt(' - Fecha de nacimiento: '),
      };

      await mongoose
        .model('Employee')
        .create(employee)
        .then((document) => prettyPrint(document))
        .catch((err) => console.log(err));
    }

    if (action === 3) {
      // Actualizar
      const id = prompt(' - ID: ');
      const employee = {
        name: prompt(' - Nombre: '),
        surnames: prompt(' - Apellidos: '),
        identificationNumber: prompt(' - DNI: '),
        birthdate: prompt(' - Fecha de nacimiento: '),
      };

      await mongoose
        .model('Employee')
        .findByIdAndUpdate(id, employee, { runValidators: true, new: true })
        .then((document) => prettyPrint(document))
        .catch((err) => console.log(err));
    }

    if (action === 4) {
      // Borrar
      const id = prompt(' - ID: ');
      await mongoose
        .model('Employee')
        .findByIdAndRemove(id)
        .then(() => console.log('documento eliminado'))
        .catch((err) => console.log(err));
    }

    if (action === 5) {
      break;
    }
  }
};

const vehicleActions = async () => {
  while (true) {
    console.log(
      '\n1 - Lista\n2 - Crear\n3 - Actualizar\n4 - Añadir revision\n5 - Borrar\n6 - Atrás\n'
    );

    let action = Number(prompt('Selecciona una acción: '));

    if (action === 1) {
      // Listado
      const vehicles = await mongoose.model('Vehicle').find({});
      prettyPrint(vehicles);
    }

    if (action === 2) {
      // Crear
      const vehicle = {
        model: prompt(' - Modelo: '),
        carplate: prompt(' - Matrícula: '),
        revisions: [],
      };

      await mongoose
        .model('Vehicle')
        .create(vehicle)
        .then((document) => prettyPrint(document))
        .catch((err) => console.log(err));
    }

    if (action === 3) {
      // Actualizar
      const id = prompt(' - ID: ');
      const vehicle = {
        model: prompt(' - Modelo: '),
        carplate: prompt(' - Matrícula: '),
      };

      await mongoose
        .model('Vehicle')
        .findByIdAndUpdate(id, vehicle, { runValidators: true, new: true })
        .then((document) => prettyPrint(document))
        .catch((err) => console.log(err));
    }

    if (action === 4) {
      // Añadir revisión
      const id = prompt(' - ID: ');
      const vehicle = {
        employee: prompt(' - ID Encargado: '),
        kilometers: Number(prompt(' - KMS: ')),
        observations: prompt(' - Observaciones: '),
      };

      await mongoose
        .model('Vehicle')
        .findByIdAndUpdate(
          id,
          {
            $push: { revisions: vehicle }, // para eliminar usar $pull
          },
          { new: true, runValidators: true }
        )
        .populate('revisions.employee')
        .then((updated) => console.log(JSON.stringify(updated, null, 2)))
        .catch((err) => console.log(err));
    }

    if (action === 5) {
      // Borrar
      const id = prompt(' - ID: ');
      await mongoose
        .model('Vehicle')
        .findByIdAndRemove(id)
        .then(() => console.log('documento eliminado'))
        .catch((err) => console.log(err));
    }

    if (action === 6) {
      break;
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
