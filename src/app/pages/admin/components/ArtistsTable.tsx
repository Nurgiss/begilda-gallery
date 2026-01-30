import type { Artist } from '../../../../types/models/Artist';

interface ArtistsTableProps {
  artists: Artist[];
  onEdit: (artist: Artist) => void;
  onDelete: (id: string) => void;
}

export function ArtistsTable({ artists, onEdit, onDelete }: ArtistsTableProps) {
  return (
    <div className="admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Фото</th>
            <th>Имя</th>
            <th>Национальность</th>
            <th>Год рождения</th>
            <th>Специализация</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {artists.map((artist) => (
            <ArtistRow
              key={artist.id}
              artist={artist}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface ArtistRowProps {
  artist: Artist;
  onEdit: (artist: Artist) => void;
  onDelete: (id: string) => void;
}

function ArtistRow({ artist, onEdit, onDelete }: ArtistRowProps) {
  return (
    <tr>
      <td>
        <img
          src={artist.image}
          alt={artist.name}
          className="admin-table-image"
          style={{ borderRadius: '50%' }}
        />
      </td>
      <td>{artist.name}</td>
      <td>{artist.nationality}</td>
      <td>{artist.born}</td>
      <td>{artist.specialty}</td>
      <td>
        <div className="admin-table-actions">
          <button className="admin-btn-edit" onClick={() => onEdit(artist)}>
            Редактировать
          </button>
          <button
            className="admin-btn-delete"
            onClick={() => onDelete(String(artist.id))}
          >
            Удалить
          </button>
        </div>
      </td>
    </tr>
  );
}
