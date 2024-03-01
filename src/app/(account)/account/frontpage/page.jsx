import Layout from '@/app/layouts/account-layout';
import Client from './page.client';
import { getUserSelf } from '../../../../utils/actions/user-actions';

export const metadata = {
	title: 'Account',
};

export default async function AccountPage() {
	const userResponseData = await getUserSelf();
	const userId = userResponseData.$id;

	return (
		<>
			<Layout>
				<Client userId={userId}/>
			</Layout>
		</>
	);
}
