/**
 *  Copyright (c) 2016, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { GraphQLObjectType, GraphQLSchema, GraphQLString } from '../../type';
import { findDescriptionChanges } from '../findDescriptionChanges';

describe('findDescriptionChanges', () => {
  const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
      field1: { type: GraphQLString },
    },
  });

  it('should detect if a description was added to a type', () => {
    const typeOld = new GraphQLObjectType({
      name: 'Type',
      fields: {
        field1: { type: GraphQLString },
      },
    });
    const typeNew = new GraphQLObjectType({
      name: 'Type',
      description: 'Something rather',
      fields: {
        field1: { type: GraphQLString },
      },
    });

    const oldSchema = new GraphQLSchema({
      query: queryType,
      types: [typeOld],
    });
    const newSchema = new GraphQLSchema({
      query: queryType,
      types: [typeNew],
    });
    expect(findDescriptionChanges(oldSchema, newSchema)[0].description).to.eql(
      'Description added on TYPE Type.',
    );
    expect(findDescriptionChanges(oldSchema, oldSchema)).to.eql([]);
    expect(findDescriptionChanges(newSchema, newSchema)).to.eql([]);
  });

  it('should detect if a description was changed on a type', () => {
    const typeOld = new GraphQLObjectType({
      name: 'Type',
      description: 'Something rather',
      fields: {
        field1: { type: GraphQLString },
      },
    });
    const typeNew = new GraphQLObjectType({
      name: 'Type',
      description: 'Something else',
      fields: {
        field1: { type: GraphQLString },
      },
    });

    const oldSchema = new GraphQLSchema({
      query: queryType,
      types: [typeOld],
    });
    const newSchema = new GraphQLSchema({
      query: queryType,
      types: [typeNew],
    });
    expect(findDescriptionChanges(oldSchema, newSchema)[0].description).to.eql(
      'Description changed on TYPE Type.',
    );
    expect(findDescriptionChanges(oldSchema, oldSchema)).to.eql([]);
    expect(findDescriptionChanges(newSchema, newSchema)).to.eql([]);
  });

  it('should detect if a type with a description was added', () => {
    const type = new GraphQLObjectType({
      name: 'Type',
      description: 'Something rather',
      fields: {
        field1: { type: GraphQLString },
      },
    });

    const oldSchema = new GraphQLSchema({
      query: queryType,
      types: [],
    });
    const newSchema = new GraphQLSchema({
      query: queryType,
      types: [type],
    });
    expect(findDescriptionChanges(oldSchema, newSchema)[0].description).to.eql(
      'New TYPE Type added with description.',
    );
    expect(findDescriptionChanges(oldSchema, oldSchema)).to.eql([]);
    expect(findDescriptionChanges(newSchema, newSchema)).to.eql([]);
  });

  it('should detect if a field with a description was added', () => {
    const typeOld = new GraphQLObjectType({
      name: 'Type',
      fields: {
        field1: { type: GraphQLString },
      },
    });
    const typeNew = new GraphQLObjectType({
      name: 'Type',
      fields: {
        field1: { type: GraphQLString },
        field2: {
          type: GraphQLString,
          description: 'Something rather',
        },
      },
    });

    const oldSchema = new GraphQLSchema({
      query: queryType,
      types: [typeOld],
    });
    const newSchema = new GraphQLSchema({
      query: queryType,
      types: [typeNew],
    });
    expect(findDescriptionChanges(oldSchema, newSchema)[0].description).to.eql(
      'New FIELD field2 added with description.',
    );
    expect(findDescriptionChanges(oldSchema, oldSchema)).to.eql([]);
    expect(findDescriptionChanges(newSchema, newSchema)).to.eql([]);
  });
});