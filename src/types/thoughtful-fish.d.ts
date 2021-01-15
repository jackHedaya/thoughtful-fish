type OptionListManipulator = (options: Option[]) => OptionExtension[]
type OptionExtension = { [key: string]: unknown } & Option

type Session = {
  accessToken: string
  refreshToken: string
}

type NextPageContext = import('next').NextPageContext
type NextApiRequest = import('next').NextApiRequest
type NextApiResponse = import('next').NextApiResponse

type ContextOrRequest = NextPageContext | NextApiRequest
