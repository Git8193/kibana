/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import { Comparator } from '../../../../../common/alerting/metrics';

export const createConditionScript = (threshold: number[], comparator: Comparator) => {
  if (comparator === Comparator.BETWEEN && threshold.length === 2) {
    return {
      source: `params.value > params.threshold0 && params.value < params.threshold1 ? 1 : 0`,
      params: {
        threshold0: threshold[0],
        threshold1: threshold[1],
      },
    };
  }
  if (comparator === Comparator.OUTSIDE_RANGE && threshold.length === 2) {
    return {
      // OUTSIDE_RANGE/NOT BETWEEN is the opposite of BETWEEN. Use the BETWEEN condition and switch the 1 and 0
      source: `params.value > params.threshold0 && params.value < params.threshold1 ? 0 : 1`,
      params: {
        threshold0: threshold[0],
        threshold1: threshold[1],
      },
    };
  }
  return {
    source: `params.value ${comparator} params.threshold ? 1 : 0`,
    params: {
      threshold: threshold[0],
    },
  };
};
