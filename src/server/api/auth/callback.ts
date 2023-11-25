import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { NextApiHandler } from 'next';

const handler: NextApiHandler = async (req, res) => {
    const { code } = req.query;

    const supabase = createPagesServerClient({ req, res });

    if (code) {
        try {
            await supabase.auth.exchangeCodeForSession(String(code));
        } catch (error) {
            console.log('EXPECTED ERROR:', error);
        }
    }

    res.redirect('/');
};

export default handler;