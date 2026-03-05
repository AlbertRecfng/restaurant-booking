import Table from '../Table/Table'
import styles from './FloorMap.module.css'

interface TableData {
  id: string
  number: number
  capacity: number
  x: number
  y: number
}

interface FloorMapProps {
  tables: TableData[]
  bookedIds: string[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export default function FloorMap({ tables, bookedIds, selectedId, onSelect }: FloorMapProps) {
  return (
    <div className={styles.floor}>
      <div className={styles.map}>
        {tables.map((table) => (
          <div
            key={table.id}
            className={styles.tableWrapper}
            style={{ left: `${table.x}%`, top: `${table.y}%` }}
          >
            <Table
              number={table.number}
              capacity={table.capacity}
              isBooked={bookedIds.includes(table.id)}
              isSelected={selectedId === table.id}
              onClick={() => onSelect(table.id)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}