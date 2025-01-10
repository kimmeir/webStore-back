import { db } from '../db'
import { DataTypes } from 'sequelize'

export interface IUser {
  id: number;
  first_name: string;
  last_name?: string;
  email: string;
  roleId: number;
  password: string;
  stripeId?: string;
  billAddressId?: number;
  shipAddressId?: number;
}

export const RolesModel = db.define('roles', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  value: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'USER',
  }
})


export enum addressEnum {
  bill = 'billAddressId',
  ship = 'shipAddressId',
}

export const AddressModel = db.define('address', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  street: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  zip: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('bill', 'ship'),
    allowNull: false,
  },
})

export const UsersModel = db.define('users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  roleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: RolesModel,
      key: 'id',
    },
    defaultValue: 1,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stripeId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  billAddressId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: AddressModel,
      key: 'id',
    },
  },
  shipAddressId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: AddressModel,
      key: 'id',
    },
  },
})

UsersModel.belongsTo(RolesModel, { foreignKey: 'roleId' })
UsersModel.belongsTo(AddressModel, { as: 'billAddress', foreignKey: 'billAddressId' })
UsersModel.belongsTo(AddressModel, { as: 'shipAddress', foreignKey: 'shipAddressId' })
