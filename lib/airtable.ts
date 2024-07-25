import { AirtableRecordType, CoffeeStoreType } from "@/types";

var Airtable = require('airtable');
var base = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN }).base('appwbOxSUQXuE7lV5');

const table = base('coffee-stores');


const getMinifiedRecords = (records: Array<AirtableRecordType>) => {
    return records.map((record: AirtableRecordType) => {
        return {
            recordId: record.id,
            ...record.fields
        };
    });
}

const findRecordByFilter = async (id: string) => {
    const findRecords = await table
      .select({
        filterByFormula: `id="${id}"`,
      })
      .firstPage();
    
      return getMinifiedRecords(findRecords);
  };
  


export const createCoffeeStore = async (coffeeStore: CoffeeStoreType, id: string) => {
    const {name, address, voting = 0, imgUrl} = coffeeStore;
    try {
            if (id) {
                const records = await findRecordByFilter(id);
                if(records.length === 0){
                    const createRecords = await table.create([
                        {
                            fields: {
                                id,
                                name,
                                address,
                                imgUrl,
                                voting,
                            },
                        },
                    ]);
                    if (createRecords.length > 0) {
                        console.log('Create a store with id', id);
                        return getMinifiedRecords(createRecords);
                    }
                    
                } else {
                    console.log('Coffee store already exists');
                    return records;
                }
            } else {
                console.error('Store id is missing');
            }
    } catch (error) {
        console.error('Error while creating or finding a coffee store', error);
    }

    
};

export const updateCoffeeStore = async (id: string) => {
    try {
            if (id) {
                const records = await findRecordByFilter(id);
                if(records.length !== 0){
                    const record = records[0];
                    const updatedVoting = record.voting + 1;
                    const updateRecords = await table.update([
                        {
                            id:record.recordId,
                            fields: {
                                voting: updatedVoting,
                            },
                        },
                    ]);
                    if (updateRecords.length > 0) {
                        console.log('Update a store with id', id);
                        return getMinifiedRecords(updateRecords);
                    }
                } else {
                    console.log('Coffee store does not exist');
                }
            } else {
                console.error('Store id is missing');
            }
    } catch (error) {
        console.error('Error while upvoting a coffee store', error);
    }

    
};