type OptionListManipulator = (options: OptionExtension[]) => OptionExtension[]
type OptionExtension = Option & {
  underlyingSymbol: string
} & { [key: string]: unknown }

type HackerResult = { options: Partial<OptionExtension>[]; meta: HackerMeta }
type HackerMeta = { cached: boolean }

type Session = {
  accessToken: string
  refreshToken: string
  profile: Profile
}

type LinkedAccount = Pick<FullLinkedAccount, 'accountId' | 'displayName'>
type Profile = Pick<UserPrincipal, 'userId' | 'primaryAccountId'> & {
  accounts: LinkedAccount[]
}

type NextPageContext = import('next').NextPageContext
type NextApiRequest = import('next').NextApiRequest
type NextApiResponse = import('next').NextApiResponse

type ContextOrRequest = NextPageContext | NextApiRequest
