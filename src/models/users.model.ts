import { OAuthProviderType } from '@/interfaces/users.interface';
import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';


class UserFromOAuthProvider {
  @prop({ type: String, required: true})
  public provider: OAuthProviderType;

  @prop({ type: String, required: true, unique: true })
  public id: string;
}


@modelOptions({ schemaOptions: { collection: 'users', timestamps: true } })
class User {
  @prop({ type: String, required: true, unique: true })
  public email: string;

  @prop({ type: String, required: true })
  public password: string;


  @prop({ type: String, required: true})
  public profileImage: string;

  @prop({type: UserFromOAuthProvider, required: true})
  public informationFromProvider: UserFromOAuthProvider;

  public createdAt?: Date;

  public updatedAt?: Date;
}


const UserModel = getModelForClass(User);

export default UserModel;
