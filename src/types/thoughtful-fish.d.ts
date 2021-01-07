type OptionListManipulator = (options: Option[]) => OptionExtension[]
type OptionExtension = { [key: string]: unknown } & Option
