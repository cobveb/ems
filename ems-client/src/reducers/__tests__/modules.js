import { modules } from 'reducers/modules';
import * as types from 'constants/actionTypes';

describe('Modules reducer', () => {
    it('should return the initial state', () => {
        expect(modules(undefined, {})).toEqual({
            modules: [],
        })
    });

    it('it should handle LOAD_MODULES_SUCCESS', () => {
        const modulesData = [
            {
                id: 1,
                code: 'accountant',
                name: 'Księgowy',
            },
            {
                id: 2,
                code: 'coordinator',
                name: 'Koordynator',
            }
        ]

        expect(modules({},{
            type: types.LOAD_MODULES_SUCCESS,
            payload: {
                modules: modulesData
            }
        })).toEqual({
            modules: [
                {
                    id: 1,
                    code: 'accountant',
                    name: 'Księgowy',
                },
                {
                    id: 2,
                    code: 'coordinator',
                    name: 'Koordynator',
                },
            ]
        })
    })
});