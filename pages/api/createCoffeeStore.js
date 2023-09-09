import {
    table,
    getMinifiedRecords,
    findRecordByFilter
  } from "../../lib/airtable";
  
  const createCoffeeStore = async (req, res) => {
    if (req.method === "POST") {
      //find a record
  
      const { id, name, neighbourhood, address, imgUrl, voting } = req.body;
      try {
        if (id) {
            const findCoffeeStoreRecords = await findRecordByFilter(id);
  
          if (findCoffeeStoreRecords.length !== 0) {
            const records = getMinifiedRecords(findCoffeeStoreRecords);
            res.json(records);
          } else {
            //create a record
            if (name) {
                const createRecords = await table.create([
                    {
                      fields: {
                        id,
                        name,
                        address,
                        neighbourhood,
                        voting,
                        imgUrl,
                      },
                    },
                ]);
  
                const records = getMinifiedRecords(createRecords);
                res.send(records);
            } else {
                res.status(400);
                res.send({ message: "Id or name is missing" });
              }
            }
          } else {
            res.status(400);
            res.send({ message: "Id is missing" });
          }
        } catch (err) {
          console.error("Error creating or finding a store", err);
          res.status(500);
          res.send({ message: "Error creating or finding a store", err });
        }
      }
    };
    export default createCoffeeStore;
  