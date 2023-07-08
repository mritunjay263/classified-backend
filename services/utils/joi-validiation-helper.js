export const validationMessageHandler = (errors ) => {
    errors.forEach(err=>{
        switch (err.code) {
        case  'any.required':
            err.message=`${err.local.label} is required !`
            break;
        case  'string.empty':
            err.message=`${err.local.label} is not allowed to be empty !`
            break;
        case  'string.base':
            err.message=`${err.local.label} must be a string !`
            break;
        case 'number.base':
            err.message=`${err.local.label} must be a number !`
            break;
        case 'boolean.base':
            err.message=`${err.local.label} must be a boolean !`
            break;
        case 'object.unknown':
            err.message=`${err.local.label} is not allowed, its a Unknow payload !`
            break;
        case 'any.only':
            err.message=`${err.local.label} not allowed, it must be one of in among, ${err.local.valids} !`
            break;
        case 'date.base':
            err.message = `${err.local.label} must be a valid date !`;
            break;
        case 'array.includesRequiredUnknowns':
            err.message = `${err.local.label} does not contain 1 required value(s)!`;
            break;
        case 'array.base':
            err.message = `${err.local.label} must be an array`;
            break;
        default:
            console.log(err.code)
            break;
        }
    });
    return errors;
}