const Dragon = require('../../lib/models/dragon');
const {assert} = require('chai');
describe('Dragon model', () => {
    it('validates with required fields', () =>{
        const dragon = new Dragon({
            name: 'Drogo',
            color: 'red',
            horde: [
                {name: 'gold', weight: 100000000},
                {name: 'artifacts', weight: 66}
            ]
        });
        return dragon.validate();
    });
    it('fails validation when required fields are missing', () => {
        const dragon = new Dragon();
        
        return dragon.validate()
            .then(
                () => { throw new Error('Expected validation error'); },
                ({ errors }) => {
                    //console.log('name errors => ',errors.name);
                    assert.ok(errors.name);
                    //console.log('color errors => ',errors.color);
                    assert.ok(errors.color);
                }
            );
    });

    it('color should be of enum type', () => {
        const dragon = new Dragon({
            name: 'foo',
            color: 'brown'
        });
        
        return dragon.validate()
            .then(
                () => { throw new Error('Expected validation error'); },
                ({ errors }) => {
                    //console.log('color errors => ',errors.color.kind);
                    assert.equal(errors.color.kind, 'enum');
                }
            );
    });
});