import { Document, Model } from "mongoose";
import { CustomIdAttributes, DocCounterAttributes } from "../types";

export const formatInternalPifId = (id: number) => String(id).padStart(6, "0");

export const updateModelCounter = async (
  doc: Document & CustomIdAttributes,
  CounterModel: Model<DocCounterAttributes>
) => {
  try {
    if (doc.isNew && !doc.ref) {
      const session = doc.$session();

      const docCounter = await CounterModel.findOne({}, null, {
        ...(session && { session }),
      }).lean();

      if (!docCounter) return;

      const { lastId, _id: counterId } = docCounter;

      doc.ref = lastId + 1;

      doc._id = formatInternalPifId(doc.ref);

      return CounterModel.updateOne(
        { _id: counterId },
        { $inc: { lastId: 1 } },
        { ...(session && { session }) }
      );
    }
  } catch (err) {
    console.log({ msg: "Error incrementing counter:", err }, "error");
    throw err; // Propagate the error to the caller
  }
};
