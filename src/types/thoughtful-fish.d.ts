type OptionListManipulator = (options: Option[]) => OptionExtension[]
type OptionExtension = { [key: string]: unknown } & Option

type Session = {
  accessToken: string
  refreshToken: string
}