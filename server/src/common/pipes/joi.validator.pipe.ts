import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { ObjectSchema } from 'joi'

@Injectable()
export class JoiValidatorPipe implements PipeTransform {
	constructor(private readonly schema: ObjectSchema) {}

	transform(value: any, metadata: ArgumentMetadata): any {
		const { error } = this.schema.validate(value)
		if (error) {
			throw new BadRequestException(error)
		}
		return value
	}
}
