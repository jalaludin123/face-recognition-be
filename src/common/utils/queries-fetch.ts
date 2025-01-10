import { faker } from '@faker-js/faker';
type defaultType = {
  tablename: string;
  data: any[];
  column: Record<string, any>;
  hasId?: boolean;
  treeId?: string;
  orderCol?: string;
  manyToMany?: {
    hasId: boolean;
    tablename: string;
    colReference: string;
    localKey: string;
    foreignKey: string;
  };
};

export const dataToInsertQuery = ({
  tablename,
  data,
  column,
  hasId = true,
  treeId,
  orderCol,
  manyToMany,
}: defaultType): string => {
  let insertStatement = `INSERT INTO ${tablename}(`;

  let manyStatement = '';

  if (manyToMany)
    manyStatement = `INSERT INTO ${manyToMany.tablename}(${
      manyToMany.hasId ? 'id, ' : ''
    }${manyToMany.localKey}, ${manyToMany.foreignKey}) VALUES\n`;

  const usedIds = new Set<string>(); // Set to track unique IDs

  const generateUniqueId = () => {
    let id;
    do {
      id = faker.string.uuid();
    } while (usedIds.has(id));
    usedIds.add(id);
    return id;
  };

  const makeRow = (dt, i, parentId = null) => {
    const id = generateUniqueId();
    const id2 = generateUniqueId();

    insertStatement += '(';

    if (hasId) insertStatement += `'${id}', `;

    if (manyStatement && Array.isArray(dt[manyToMany.colReference]))
      dt[manyToMany.colReference].forEach((e) => {
        manyStatement += `(${
          manyToMany.hasId ? `'${id2}', ` : ''
        }'${id}', '${e}'),\n`;
      });

    if (treeId) insertStatement += parentId ? `'${parentId}', ` : 'null, ';
    if (orderCol) insertStatement += `${i + 1}, `;

    Object.keys(column).forEach((col, i) => {
      if (!dt[col] && !['boolean', 'string', 'number'].includes(typeof dt[col]))
        insertStatement += column[col];
      else if (Array.isArray(dt[col]))
        insertStatement += '\'{"' + dt[col].join('","') + '"}\'';
      else if (typeof dt[col] === 'string')
        insertStatement += `'${dt[col].replaceAll("'", "''")}'`;
      else insertStatement += dt[col];

      if (i + 1 !== Object.keys(column).length) insertStatement += ', ';
    });

    insertStatement += '),\n';

    if (dt?.children && Array.isArray(dt.children) && treeId)
      dt.children.forEach((e, z) => makeRow(e, z, id));
  };

  const colSet = {
    ...(hasId ? { id: null } : {}),
    ...(treeId ? { [treeId]: null } : {}),
    ...(orderCol ? { [orderCol]: null } : {}),
    ...column,
  };
  Object.keys(colSet).forEach((e, i) => {
    insertStatement += `"${e}"`;
    if (Object.keys(colSet).length > i + 1) insertStatement += ', ';
  });

  insertStatement += ') VALUES\n';

  data.forEach((dt, i) => makeRow(dt, i));

  const lastComa = insertStatement.lastIndexOf(',');

  if (lastComa >= 0)
    insertStatement = insertStatement.substring(0, lastComa) + ';';

  if (manyToMany) {
    const lastComaMany = manyStatement.lastIndexOf(',');
    if (lastComaMany >= 0)
      manyStatement = manyStatement.substring(0, lastComaMany) + ';';
  }

  return insertStatement + '\n' + manyStatement;
};

export const dataToDeleteQuery = (tablename: string, where?: string) => {
  let resp = `DELETE FROM ${tablename} `;

  if (where) resp += `where ${where}`;

  return resp;
};

export const filterGqlToWhereSql = (
  data: Record<string, any>,
  alias: string = null,
  isOr = false
) => {
  let res = '';

  const convertVal = (val: any) => {
    if (Array.isArray(val))
      return `(${val.map((e) => convertVal(e)).join(',')})`;
    if (typeof val == 'string') return `'${val}'`;

    return val;
  };

  const setCol = (col: string) => `${alias ? `"${alias}".` : ''}"${col}"`;

  Object.keys(data).forEach((key) => {
    if (res.length) res += ' ' + (isOr ? 'OR' : 'AND');

    if (['and', 'or'].includes(key))
      res += Array.isArray(data[key])
        ? `(${data[key]
            .map((e) => `${filterGqlToWhereSql(e, alias, key == 'or')}`)
            .join(key == 'or' ? ' OR ' : ' AND ')})`
        : `(${filterGqlToWhereSql(data[key], alias, key == 'or')})`;

    if (Object.keys(data[key]).includes('eq'))
      res += ` ${setCol(key)} = ${convertVal(data[key]['eq'])}`;
    if (Object.keys(data[key]).includes('gt'))
      res += ` ${setCol(key)} < ${convertVal(data[key]['gt'])}`;
    if (Object.keys(data[key]).includes('gte'))
      res += ` ${setCol(key)} <= ${convertVal(data[key]['gte'])}`;
    if (Object.keys(data[key]).includes('iLike'))
      res += ` ${setCol(key)} LIKE ${convertVal(data[key]['iLike'])}`;
    if (Object.keys(data[key]).includes('in'))
      res += ` ${setCol(key)} IN ${convertVal(data[key]['in'])}`;
    if (Object.keys(data[key]).includes('is'))
      res += ` ${setCol(key)} = ${convertVal(data[key]['is'])}`;
    if (Object.keys(data[key]).includes('isNot'))
      res += ` ${setCol(key)} != ${convertVal(data[key]['isNot'])}`;
    if (Object.keys(data[key]).includes('like'))
      res += ` ${setCol(key)} = ${convertVal(data[key]['like'])}`;
    if (Object.keys(data[key]).includes('lt'))
      res += ` ${setCol(key)} < ${convertVal(data[key]['lt'])}`;
    if (Object.keys(data[key]).includes('lte'))
      res += ` ${setCol(key)} <= ${convertVal(data[key]['lte'])}`;
    if (Object.keys(data[key]).includes('neq'))
      res += ` ${setCol(key)} != ${convertVal(data[key]['neq'])}`;
    if (Object.keys(data[key]).includes('notILike'))
      res += ` ${setCol(key)} NOT LIKE ${convertVal(data[key]['notILike'])}`;
    if (Object.keys(data[key]).includes('notIn'))
      res += ` ${setCol(key)} NOT IN ${convertVal(data[key]['notIn'])}`;
    if (Object.keys(data[key]).includes('notLike'))
      res += ` ${setCol(key)} != ${convertVal(data[key]['notLike'])}`;
  });

  return res;
};
