import { GetServerSideProps, GetServerSidePropsContext,GetServerSidePropsResult } from "next";
import { parseCookies,destroyCookie } from 'nookies'
import { AutenticarTokenError } from '../servicos/erros/AutenticarTokenError'
export function cansSSRAuth<P>(fn:GetServerSideProps<P>){
    return async(ctx:GetServerSidePropsContext):Promise<GetServerSidePropsResult<P>>=>{

        const cookies =  parseCookies(ctx);


        const token = cookies['@digifood.token']

        if(!token){
            return{
                redirect:{
                    destination:'/Login',
                    permanent:false,
                }
            }
        }
        try{
            return await fn(ctx);
        }catch(err){
            if(err instanceof AutenticarTokenError){
                destroyCookie(ctx,'@digifood.token')


                return{
                    redirect:{
                        destination:'/Login',
                        permanent:false
                    }
                }
            }
        }


    }

}

