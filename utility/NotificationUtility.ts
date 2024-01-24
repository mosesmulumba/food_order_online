// otp
export const GenerateOtp = () =>{
    const otp = Math.floor(100000 + Math.random() * 900000);
    let expiry = new Date();
    expiry.setTime(new Date().getTime()+(30*60*1000));

    return {otp , expiry}
}

export const onRequestOtp =  async(otp: number, toPhoneNumber: string)=>{
    const accountSid = '';
    const tokenAuth = '';

    const client = require('twilio')(accountSid , tokenAuth);

    const fromNumber = '+15005550006';

    const response = await client.messages.create({
        body: `Your OTP is ${otp}`,
        from: fromNumber,
        to: `+256${toPhoneNumber}`,
    });

    return response;
}