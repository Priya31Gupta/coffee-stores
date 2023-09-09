import {table, findRecordByFilter, getMinifiedRecords } from "../../lib/airtable";

const favouriteCoffeeStoreById = async (req,res) => {
    if (req.method === "PUT") {
        const  {id} = req.body;
        try{
            if(id){
                const record = await findRecordByFilter(id);
                if(record.length > 0){
                    const updateRecord = await table.update([
                        {
                          id: record.recordId,
                          fields: {
                            voting: parseInt(record.voting)+1,
                          },
                        },
                    ]);
                    if (updateRecord) {
                        const minifiedRecords = getMinifiedRecords(updateRecord);
                        res.json(minifiedRecords);
                    }
                }else{
                    res.send({message: "Coffee store id doesn't exist", id});
                }
    
            }else{
                res.status(400);
                res.send({message: "Id is missing", id});
            }
        }catch(err){
            res.status(500);
            res.send({message: "Error upvoting coffee store", err});
        }
    }
}

export default favouriteCoffeeStoreById;