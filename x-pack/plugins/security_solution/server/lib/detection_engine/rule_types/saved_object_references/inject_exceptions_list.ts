/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { Logger, SavedObjectReference } from '@kbn/core/server';
import type { RuleParams } from '../../rule_schema';
import { getSavedObjectReferenceForExceptionsList, logMissingSavedObjectError } from './utils';

/**
 * This injects any "exceptionsList" "id"'s from saved object reference and returns the "exceptionsList" using the saved object reference. If for
 * some reason it is missing on saved object reference, we log an error about it and then take the last known good value from the "exceptionsList"
 *
 * @param logger The kibana injected logger
 * @param exceptionsList The exceptions list to merge the saved object reference from.
 * @param savedObjectReferences The saved object references which should contain an "exceptionsList"
 * @returns The exceptionsList with the saved object reference replacing any value in the saved object's id.
 */
export const injectExceptionsReferences = ({
  logger,
  exceptionsList,
  savedObjectReferences,
}: {
  logger: Logger;
  exceptionsList: RuleParams['exceptionsList'];
  savedObjectReferences: SavedObjectReference[];
}): RuleParams['exceptionsList'] =>
  (exceptionsList ?? []).map((exceptionItem, index) => {
    const savedObjectReference = getSavedObjectReferenceForExceptionsList({
      logger,
      index,
      savedObjectReferences,
    });
    if (savedObjectReference != null) {
      const reference: RuleParams['exceptionsList'][0] = {
        ...exceptionItem,
        id: savedObjectReference.id,
      };
      return reference;
    } else {
      logMissingSavedObjectError({
        logger,
        missingFieldValue: exceptionItem,
        missingField: 'exception list',
      });
      return exceptionItem;
    }
  });
