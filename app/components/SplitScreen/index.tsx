import classes from "./styles.module.css"

interface Props {
  left: React.ReactNode
  right: React.ReactNode
}

const SplitScreen: React.FC<Props> = ({ left, right }) => (
  <div className={classes.container}>
    <div className={classes.left}>{left}</div>
    <div className={classes.right}>{right}</div>
  </div>
)

export default SplitScreen
