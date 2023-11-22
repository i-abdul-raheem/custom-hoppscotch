import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ReqType } from 'src/types/RequestTypes';

@ObjectType()
export class UserHistory {
  @Field(() => ID, {
    description: 'ID of the user request in history',
  })
  id: string;

  @Field(() => ID, {
    description: 'ID of the user this history belongs to',
  })
  userUid: string;

  @Field(() => ReqType, {
    description: 'Type of the request in the history',
  })
  reqType: ReqType;

  @Field({
    description: 'JSON string representing the request data',
  })
  request: string;

  @Field({
    description: 'JSON string representing the response meta-data',
  })
  responseMetadata: string;

  @Field({
    description: 'If the request in the history starred',
  })
  isStarred: boolean;

  @Field({
    description:
      'Timestamp of when the request was executed or history was created',
  })
  executedOn: Date;
}

@ObjectType()
export class UserHistoryDeletedManyData {
  @Field(() => Number, {
    description: 'Number of user histories deleted',
  })
  count: number;
  @Field(() => ReqType, {
    description: 'Type of the request in the history',
  })
  reqType: ReqType;
}

registerEnumType(ReqType, {
  name: 'ReqType',
});
