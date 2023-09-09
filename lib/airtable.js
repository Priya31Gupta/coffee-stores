const Airtable = require("airtable");
const base = new Airtable({ apiKey: 'patSyMW3Mocx7oI9J.47ca45bee1a08a79a081560edaad3b852dbb5c9b3bbbdd7a613c71a20eb28b51' }).base(
  process.env.AIRTABLE_BASE_KEY
);

const table = base("coffee-stores");
const getMinifiedRecord = (record) => {
  return {
    recordId: record.id,
    ...record.fields,
  };
};

const getMinifiedRecords = (records) => {
  return records.map((record) => getMinifiedRecord(record));
};

const findRecordByFilter = async (id) => {
  const findCoffeeStoreRecords = await table
    .select({
      filterByFormula: `id="${id}"`,
    })
    .firstPage();

  return getMinifiedRecords(findCoffeeStoreRecords);
};

export { table, getMinifiedRecords, findRecordByFilter };