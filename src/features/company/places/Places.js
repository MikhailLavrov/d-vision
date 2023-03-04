import c from './Places.module.css';

export const Places = ({ nodes, handleShowInventory }) => {
  if (!nodes || nodes.length === 0) return null;

  return (
    <ul className={c.places}>
      {nodes.map((node) => (
        <li key={node.id} onClick={handleShowInventory}>
          {node.parts 
          ? <details className={c.places__details} open>
              <summary className={c.places__summary} id={node.id}>
                <div className={c.places__placeSummary} id={node.id}>
                  <span className={`${c.places__countBadge} ${node.localInventCount === 0 ? c.places__countBadgeRed : c.places__countBadgeGreen}`}>
                    {node.localInventCount}
                  </span>
                  <p id={node.id}>
                    {node.name}
                  </p>
                  <p className={`${c.places__totalCountBadge}`}>
                    <span>Общий инвентарь: </span>
                    <span className={`${c.places__countBadge} ${node.total === 0 ? c.places__countBadgeRed : c.places__countBadgeGreen}`}>
                      {node.inventoryTotal}
                    </span>
                  </p>
                </div>
              </summary>
              <Places nodes={node.parts} />
            </details>

          : <div id={node.id} className={c.places__placeInner}>
              <span className={`${c.places__countBadge} ${node.localInventCount === 0 ? c.places__countBadgeRed : c.places__countBadgeGreen}`}>
                {node.localInventCount}
              </span>
              <p id={node.id}>{node.name}</p>
            </div>
          }
        </li>
      ))}
    </ul>
  );
};