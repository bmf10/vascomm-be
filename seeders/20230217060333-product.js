'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('products', [
      {
        id: 1,
        name: 'Exolida',
        price: 100_000,
        status: 'active',
        image: 'Exodia-1696774864199.png',
      },
      {
        id: 2,
        name: 'Eolida',
        price: 120_000,
        status: 'active',
        image: 'Exodia-1696774864199.png',
      },
      {
        id: 3,
        name: 'Exoda',
        price: 150_000,
        status: 'active',
        image: 'Exodia-1696774864199.png',
      },
      {
        id: 4,
        name: 'Exoli',
        price: 200_000,
        status: 'active',
        image: 'Exodia-1696774864199.png',
      },
      {
        id: 5,
        name: 'Eda',
        price: 310_000,
        status: 'active',
        image: 'Exodia-1696774864199.png',
      },
      {
        id: 6,
        name: 'Exida',
        price: 590_000,
        status: 'active',
        image: 'Exodia-1696774864199.png',
      },
    ])
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('products', {
      id: [1, 2, 3, 4, 5, 6],
    })
  },
}
