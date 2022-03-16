import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';

@modelOptions({ schemaOptions: { collection: 'counters', timestamps: true } })
class Counter {
  @prop({ type: Number })
  public seq: number;
}

const CounterModel = getModelForClass(Counter);

export default CounterModel;

export async function getNextSequence(_id: string) {
  const got = await CounterModel.findOneAndUpdate(
    { _id },
    {
      $inc: {
        seq: 1,
      },
    },
    { returnOriginal: false, upsert: true },
  );
  return got.seq;
}
