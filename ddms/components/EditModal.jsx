export default function EditModal({ title = 'Edit', children, onClose }){
	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
			<div className="bg-white p-6 rounded shadow w-full max-w-md">
				<div className="flex justify-between items-center mb-4">
					<h3 className="text-lg font-semibold">{title}</h3>
					<button onClick={onClose} className="text-gray-500">Close</button>
				</div>
				<div>{children}</div>
			</div>
		</div>
	);
}
