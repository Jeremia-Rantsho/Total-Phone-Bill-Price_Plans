import assert from 'assert';
import totalPhoneBill from '/public/totalPhoneBill.js';

describe('totalPhone Bill test', function(){
    it('It should get the total of the actions correctly', function () {
        assert.equal('R7.45', totalPhoneBill('call,sms,call,sms,sms'));
        assert.equal('R3.40', totalPhoneBill('call,sms'));
        assert.equal('R1.30', totalPhoneBill('sms,sms'));
    });

    it('should test empty input to return 0.00', function () {
        assert.equal('R0.00', totalPhoneBill(' '));
    });

    it('should handle case variations', function () {
        assert.equal('R0.66', totalPhoneBill('CALL'));
        assert.equal('R0.29', totalPhoneBill('SMS'));
        assert.equal('R1.30', totalPhoneBill('sms,SMS'));
    });

    it('should handle leading and trailing spaces in input', function () {
        assert.equal('R1.95', totalPhoneBill('  call, sms, call  '));
    });
    
    
});

