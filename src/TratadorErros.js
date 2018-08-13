import PubSub from 'pubsub-js';

export default class TratadorErros{
    publicaErros(erros){
        console.log(erros +"eee");
        for (let index = 0; index < erros.errors.length; index++) {
            const erro = erros.errors[index];
            PubSub.publish('erro-validacao', erro);
            
        }
    }
}