import { Schema, model, Document} from "mongoose";

export interface IHive extends Document {
	name: string,
	data: {
		time: Date,
		weight: number
	}[]

}

const HiveSchema: Schema<IHive> = new Schema({
	name: String,
	data: [{time: Date, weight: Number}]
});

const Hive = model<IHive>("hive", HiveSchema);

export { Hive };
